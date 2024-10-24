<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import PostVote from './PostVote.svelte'
  import { getInstance, site } from '$lib/lemmy.js'
  import {
    ArrowsUpDown,
    ArrowTopRightOnSquare,
    Bookmark,
    BookmarkSlash,
    BugAnt,
    ChatBubbleLeftEllipsis,
    ChatBubbleOvalLeft,
    ChatBubbleOvalLeftEllipsis,
    CheckBadge,
    Clock,
    EllipsisHorizontal,
    Eye,
    EyeSlash,
    Flag,
    GlobeAmericas,
    Icon,
    Language,
    MapPin,
    Newspaper,
    Pencil,
    PencilSquare,
    ServerStack,
    Share,
    Star,
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
  import { deleteItem, markAsRead, save } from '$lib/lemmy/contentview.js'
  import { setSessionStorage } from '$lib/session.js'
  import { goto } from '$app/navigation'
  import { userSettings, type View } from '$lib/settings.js'
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
  import { t } from '$lib/translations'
  import { text } from '$lib/components/translate/translation'
  import { hidePost, postLink } from './helpers'
  import { feature } from '$lib/version'
  import Switch from '$lib/components/input/Switch.svelte'
  import { instanceId, instanceToURL } from '$lib/util'
  import { publishedToDate } from '$lib/components/util/date'
  import TextProps from '$lib/components/ui/text/TextProps.svelte'
  import { communityLink, userLink } from '$lib/lemmy/generic'
  import RelativeDate, {
    formatRelativeDate,
  } from '$lib/components/util/RelativeDate.svelte'

  export let post: PostView
  export let view: View = 'cozy'
  export let debug: boolean = false

  const dispatcher = createEventDispatcher<{ edit: PostView; hide: boolean }>()

  let editing = false
  let saving = false

  let translating = false

  let localShare = false

  $: buttonHeight = view == 'compact' ? 'h-7' : 'h-8'
  $: buttonSquare = view == 'compact' ? 'w-7 h-7' : 'w-8 h-8'

  export let style: string = ''
</script>

{#if editing}
  <Modal bind:open={editing}>
    <h1 slot="title" class="text-2xl font-bold">Editing post</h1>
    {#await import('./form/PostForm.svelte')}
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
  {#await import('$lib/components/translate/Translation.svelte') then { default: Translation }}
    <Translation bind:open={translating} />
  {/await}
{/if}

<footer
  class="flex flex-row gap-2 items-center flex-shrink-0 {buttonHeight}"
  class:flex-row-reverse={$userSettings.posts.reverseActions}
  {style}
>
  <PostVote
    post={post.post}
    bind:vote={post.my_vote}
    bind:score={post.counts.score}
    bind:upvotes={post.counts.upvotes}
    bind:downvotes={post.counts.downvotes}
    showCounts={$profile?.user?.local_user_view?.local_user?.show_scores ??
      true}
  />

  <Button
    size="custom"
    href="{postLink(post.post)}#comments"
    class="!text-inherit h-full px-3 relative"
    color="ghost"
    rounding="pill"
    target={$userSettings.openLinksInNewTab ? '_blank' : ''}
    title={$t('post.actions.comments')}
    animations={{ scale: true, large: false }}
  >
    {@const newComment =
      publishedToDate(post.counts.newest_comment_time).getTime() >
      new Date().getTime() - 5 * 60 * 1000}
    <Icon
      src={newComment ? ChatBubbleOvalLeftEllipsis : ChatBubbleOvalLeft}
      size="18"
    />
    <FormattedNumber number={post.counts.comments} />
  </Button>
  <div class="flex-1" />

  {#if $userSettings.debugInfo}
    {#if debug}
      {#await import('$lib/components/util/debug/DebugObject.svelte') then { default: DebugObject }}
        <DebugObject object={post} bind:open={debug} />
      {/await}
    {/if}
    <Button
      on:click={() => (debug = true)}
      title="Debug"
      size="custom"
      color="ghost"
      rounding="pill"
      class={buttonSquare}
      animations={{ scale: true, large: true }}
    >
      <Icon src={BugAnt} micro size="16" slot="prefix" />
    </Button>
  {/if}
  {#if $profile?.user && (amMod($profile.user, post.community) || isAdmin($profile.user))}
    <ModerationMenu
      size="custom"
      color="ghost"
      rounding="pill"
      class={buttonSquare}
      bind:item={post}
      community={post.community}
    />
  {/if}

  {#if $profile?.jwt}
    <Button
      on:click={async () => {
        if (!$profile?.jwt) return
        saving = true
        post.saved = await save(post, !post.saved, $profile?.jwt)
        saving = false
      }}
      size="custom"
      class={buttonSquare}
      color="ghost"
      rounding="pill"
      loading={saving}
      disabled={saving}
      title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
      animations={{ scale: true, large: true }}
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
      rounding="pill"
      size="custom"
      class={buttonSquare}
      animations={{ scale: true, large: true }}
    >
      <Icon slot="prefix" src={EllipsisHorizontal} width={16} micro />
    </Button>
    <MenuDivider>{$t('cards.site.stats')}</MenuDivider>
    <div class="flex flex-row gap-1 items-center">
      <MenuButton class="flex-1">
        <Icon src={Clock} size="16" micro slot="prefix" />
        <span>
          {publishedToDate(post.post.published).toLocaleDateString(undefined, {
            dateStyle: 'short',
          })}
        </span>
      </MenuButton>
      {#if post.post.updated}
        {@const editedTime = formatRelativeDate(
          publishedToDate(post.post.updated),
          {
            style: 'long',
          }
        )}
        <MenuButton class="flex-1" aria-label={editedTime}>
          <Icon src={Pencil} size="16" micro slot="prefix" />
          <RelativeDate date={publishedToDate(post.post.updated)} />
        </MenuButton>
      {/if}
    </div>
    {#if post.counts.score}
      {@const ratio =
        post.counts.upvotes / (post.counts.upvotes + post.counts.downvotes)}
      <MenuButton
        aria-label={$t('aria.vote.score', { default: post.counts.score })}
      >
        <Icon src={ArrowsUpDown} size="16" micro slot="prefix" />
        {$t('post.actions.vote.score')}
        •
        <FormattedNumber
          number={post.counts.score}
          options={{ notation: 'standard' }}
          class="font-medium"
        />
        •
        <FormattedNumber
          number={ratio}
          options={{ style: 'percent' }}
          class="font-medium {ratio > 0.7
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-red-500'}"
        />
      </MenuButton>
    {/if}
    <MenuDivider>{$t('post.actions.more.creator')}</MenuDivider>
    <MenuButton link href={userLink(post.creator)}>
      <Icon
        src={UserCircle}
        size="16"
        micro
        slot="prefix"
        class="flex-shrink-0"
      />
      <TextProps wrap="no-wrap">
        {post.creator.name}
      </TextProps>
    </MenuButton>
    <MenuButton link href={communityLink(post.community)}>
      <Icon
        src={Newspaper}
        size="16"
        micro
        slot="prefix"
        class="flex-shrink-0"
      />
      <TextProps wrap="no-wrap">
        {post.community.title}
      </TextProps>
    </MenuButton>
    <MenuDivider>
      {$t('post.actions.more.actions')}
    </MenuDivider>
    {#if $profile?.user && $profile?.jwt && $profile.user.local_user_view.person.id == post.creator.id}
      <MenuButton on:click={() => (editing = true)}>
        <Icon src={PencilSquare} size="16" micro slot="prefix" />
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
        <Icon slot="prefix" src={post.read ? EyeSlash : Eye} size="16" micro />
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
      class="flex-1 !py-0"
    >
      <Icon src={Share} size="16" micro slot="prefix" />
      {$t('post.actions.more.share')}
      <div class="flex-1" />
      {#if !post.post.local}
        <div class="flex">
          <Button
            color={!localShare ? 'primary' : 'secondary'}
            size="square-md"
            roundingSide="left"
            on:click={() => (localShare = false)}
            title={$t('filter.location.global')}
          >
            <Icon src={GlobeAmericas} size="16" micro />
          </Button>
          <Button
            color={localShare ? 'primary' : 'secondary'}
            size="square-md"
            roundingSide="right"
            on:click={() => (localShare = true)}
            title={$t('filter.location.local')}
          >
            <Icon src={MapPin} size="16" micro />
          </Button>
        </div>
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
        <Icon src={Language} size="16" micro slot="prefix" />
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
        <Icon src={ArrowTopRightOnSquare} size="16" micro slot="prefix" />
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
          <Icon src={Trash} size="16" micro slot="prefix" />
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
            <Icon slot="prefix" src={XMark} size="16" micro />
            {post.hidden
              ? $t('post.actions.more.unhide')
              : $t('post.actions.more.hide')}
          </MenuButton>
        {/if}
        <MenuButton on:click={() => report(post)} color="danger-subtle">
          <Icon src={Flag} width={16} micro slot="prefix" />
          {$t('moderation.report')}
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</footer>
