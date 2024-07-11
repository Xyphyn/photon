<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import PostVote from './PostVote.svelte'
  import { getInstance, site } from '$lib/lemmy.js'
  import {
    ArrowTopRightOnSquare,
    Bookmark,
    BookmarkSlash,
    BugAnt,
    ChatBubbleOvalLeft,
    ChatBubbleOvalLeftEllipsis,
    EllipsisHorizontal,
    Eye,
    EyeSlash,
    Flag,
    GlobeAlt,
    Home,
    Icon,
    Language,
    Newspaper,
    PencilSquare,
    ServerStack,
    Share,
    Trash,
    UserCircle,
    XMark,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    amMod,
    isAdmin,
    report,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import ModerationMenu from '$lib/components/lemmy/moderation/ModerationMenu.svelte'
  import { profile } from '$lib/auth.js'
  import {
    contentView,
    deleteItem,
    markAsRead,
    save,
  } from '$lib/lemmy/contentview.js'
  import { setSessionStorage } from '$lib/session.js'
  import { goto } from '$app/navigation'
  import { userSettings } from '$lib/settings.js'
  import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Modal,
    Spinner,
    toast,
  } from 'mono-svelte'
  import { fediseer, type Data } from '$lib/fediseer/fediseer'
  import Fediseer from '$lib/fediseer/Fediseer.svelte'
  import { t } from '$lib/translations'
  import { text } from '$lib/components/translate/translation'
  import Translation from '$lib/components/translate/Translation.svelte'
  import { hidePost, postLink } from './helpers'
  import { feature } from '$lib/version'
  import Switch from '$lib/components/input/Switch.svelte'
  import { instanceToURL } from '$lib/util'

  export let post: PostView

  const dispatcher = createEventDispatcher<{ edit: PostView; hide: boolean }>()

  let editing = false
  let saving = false
  export let debug: boolean = false

  let fediseerOpen = false
  let fediseerData: Data | null = null
  let fediseerLoading = false

  let translating = false

  let localShare = false
</script>

{#if fediseerData}
  <Fediseer bind:open={fediseerOpen} data={fediseerData} />
{/if}

{#if editing}
  <Modal bind:open={editing}>
    <h1 slot="title" class="text-2xl font-bold">Editing post</h1>
    {#await import('./PostForm.svelte')}
      <div class="mx-auto h-96 flex justify-center items-center">
        <Spinner width={32} />
      </div>
    {:then { default: PostForm }}
      <PostForm
        edit
        editingPost={post.post}
        on:submit={(e) => {
          editing = false
          post = e.detail
          dispatcher('edit', e.detail)
        }}
      >
        <svelte:fragment slot="formtitle">
          <!-- Have the title not exist at all -->
          {''}
        </svelte:fragment>
      </PostForm>
    {/await}
  </Modal>
{/if}

{#if translating}
  <Translation bind:open={translating} />
{/if}

<div
  class="flex flex-row gap-2 items-center !h-8 flex-shrink-0"
  style={$$props.style ?? ''}
>
  <PostVote
    post={post.post}
    bind:vote={post.my_vote}
    bind:score={post.counts.score}
    bind:upvotes={post.counts.upvotes}
    bind:downvotes={post.counts.downvotes}
  />

  <Button
    size="sm"
    href="/post/{getInstance()}/{post.post.id}"
    class="!text-inherit h-8 px-3"
    target={$userSettings.openLinksInNewTab ? '_blank' : ''}
    title={$t('post.actions.comments')}
  >
    <Icon slot="prefix" src={ChatBubbleOvalLeft} mini size="14" />
    <FormattedNumber number={post.counts.comments} />
  </Button>
  <div class="ml-auto" />

  {#if $userSettings.debugInfo}
    {#if debug}
      {#await import('$lib/components/util/debug/DebugObject.svelte') then { default: DebugObject }}
        <DebugObject object={post} bind:open={debug} />
      {/await}
    {/if}
    <Button
      on:click={() => (debug = true)}
      title="Debug"
      size="square-md"
      color="ghost"
    >
      <Icon src={BugAnt} mini size="16" slot="prefix" />
    </Button>
  {/if}
  {#if $profile?.user && (amMod($profile.user, post.community) || isAdmin($profile.user))}
    <ModerationMenu bind:item={post} community={post.community} />
  {/if}

  {#if $profile?.jwt}
    <Button
      on:click={async () => {
        if (!$profile?.jwt) return
        saving = true
        post.saved = await save(post, !post.saved, $profile?.jwt)
        saving = false
      }}
      size="square-md"
      color="ghost"
      loading={saving}
      disabled={saving}
      title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
    >
      <Icon
        src={post.saved ? BookmarkSlash : Bookmark}
        size="16"
        mini
        slot="prefix"
      />
    </Button>
  {/if}

  <Menu
    placement="bottom-end"
    containerClass="overflow-auto max-h-[400px]"
    class="h-8"
    targetClass="h-full"
    title={$t('post.actions.more.label')}
  >
    <Button
      slot="target"
      title={$t('post.actions.more.label')}
      color="ghost"
      size="square-md"
    >
      <Icon slot="prefix" src={EllipsisHorizontal} width={16} mini />
    </Button>
    <MenuDivider>{$t('post.actions.more.creator')}</MenuDivider>
    <MenuButton
      link
      href="/u/{post.creator.name}@{new URL(post.creator.actor_id).hostname}"
    >
      <Icon src={UserCircle} width={16} mini slot="prefix" />
      <span>{post.creator.name}</span>
    </MenuButton>
    <MenuButton
      link
      href="/c/{post.community.name}@{new URL(post.community.actor_id)
        .hostname}"
    >
      <Icon src={Newspaper} width={16} mini slot="prefix" />
      <span>{post.community.title}</span>
    </MenuButton>
    <MenuButton
      loading={fediseerLoading}
      on:click={async (e) => {
        e.stopImmediatePropagation()

        fediseerLoading = true
        const data = await fediseer.getInstanceInfo(
          new URL(post.community.actor_id).hostname
        )
        fediseerData = data
        fediseerOpen = true
        fediseerLoading = false

        return
      }}
    >
      <svelte:fragment slot="prefix">
        {#if fediseerLoading}
          <Spinner width={14} />
        {:else}
          <Icon src={ServerStack} width={16} mini />
        {/if}
      </svelte:fragment>
      <span>{new URL(post.community.actor_id).hostname}</span>
    </MenuButton>
    <hr class="w-[90%] mx-auto opacity-100 dark:opacity-10 my-2" />
    <MenuDivider>{$t('post.actions.more.actions')}</MenuDivider>
    {#if $profile?.user && $profile?.jwt && $profile.user.local_user_view.person.id == post.creator.id}
      <MenuButton on:click={() => (editing = true)}>
        <Icon src={PencilSquare} width={16} mini slot="prefix" />
        {$t('post.actions.more.edit')}
      </MenuButton>
    {/if}
    {#if $profile?.jwt}
      <MenuButton
        on:click={async () => {
          if ($profile?.jwt)
            post.read = await markAsRead(post.post, !post.read, $profile.jwt)
        }}
      >
        <Icon slot="prefix" src={post.read ? EyeSlash : Eye} width={16} mini />
        {post.read
          ? $t('post.actions.more.markUnread')
          : $t('post.actions.more.markRead')}
      </MenuButton>
    {/if}
    <MenuButton
      on:click={() => {
        navigator.share?.({
          url: localShare
            ? `${instanceToURL(getInstance())}/post/${post.post.id}`
            : post.post.ap_id,
        }) ??
          navigator.clipboard.writeText(
            localShare
              ? `${instanceToURL(getInstance())}/post/${post.post.id}`
              : post.post.ap_id
          )
        toast({ content: $t('toast.copied') })
      }}
      class="flex-1 py-0"
    >
      <Icon src={Share} width={16} mini slot="prefix" />
      {$t('post.actions.more.share')}
      {#if !post.post.local}
        <Switch
          optionNames={[
            $t('filter.location.global'),
            $t('filter.location.local'),
          ]}
          options={[false, true]}
          bind:selected={localShare}
          class="ml-auto"
          buttonClass="!py-1"
        />
      {/if}
    </MenuButton>
    {#if post.post.body && $userSettings.translator}
      <MenuButton
        on:click={() => {
          // @ts-ignore
          text.set(post.post.body)
          translating = !translating
        }}
      >
        <Icon src={Language} size="16" mini slot="prefix" />
        {$t('post.actions.more.translate')}
      </MenuButton>
    {/if}
    {#if $profile?.jwt}
      <MenuButton
        on:click={() => {
          setSessionStorage('postDraft', {
            body: `${
              $userSettings.crosspostOriginalLink
                ? `cross-posted from: ${post.post.ap_id}`
                : ``
            }\n${
              post.post.body
                ? '>' + post.post.body.split('\n').join('\n> ')
                : ''
            }`,
            url: post.post.url,
            title: post.post.name,
            loading: false,
            nsfw: post.post.nsfw,
            community: null,
            image: null,
          })

          goto('/create/post?crosspost=true')
        }}
      >
        <Icon src={ArrowTopRightOnSquare} width={16} mini slot="prefix" />
        {$t('post.actions.more.crosspost')}
      </MenuButton>
      {#if $profile.user && post.creator.id == $profile.user.local_user_view.person.id}
        <MenuButton
          on:click={async () => {
            if ($profile?.jwt)
              post.post.deleted = await deleteItem(
                post,
                !post.post.deleted,
                $profile.jwt
              )
          }}
          color="danger-subtle"
        >
          <Icon src={Trash} width={16} mini slot="prefix" />
          {post.post.deleted
            ? $t('post.actions.more.restore')
            : $t('post.actions.more.delete')}
        </MenuButton>
      {/if}
      {#if $profile.user?.local_user_view.person.id != post.creator.id}
        {#if feature('hidePosts', $site?.version)}
          <MenuButton
            on:click={async () => {
              if (!$profile?.jwt) return
              const hidden = await hidePost(
                post.post.id,
                !post.hidden,
                $profile?.jwt
              )
              post.hidden = hidden
              if (hidden) {
                dispatcher('hide', hidden)
              }
            }}
            color="danger-subtle"
          >
            <Icon slot="prefix" src={XMark} size="16" mini />
            {post.hidden
              ? $t('post.actions.more.unhide')
              : $t('post.actions.more.hide')}
          </MenuButton>
        {/if}
        <MenuButton on:click={() => report(post)} color="danger-subtle">
          <Icon src={Flag} width={16} mini slot="prefix" />
          {$t('moderation.report')}
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
