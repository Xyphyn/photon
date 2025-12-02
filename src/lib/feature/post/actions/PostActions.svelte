<script lang="ts">
  import { page } from '$app/state'
  import type { PostView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'
  import { settings, type View } from '$lib/app/settings.svelte'
  import { instanceToURL } from '$lib/app/util.svelte'
  import { save } from '$lib/feature/legacy/contentview'
  import { Photon } from '$lib/ui/icon/photon'
  import { publishedToDate } from '$lib/ui/util/date'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import {
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    Modal,
    Spinner,
    toast,
  } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    BugAnt,
    ChatBubbleOvalLeft,
    ChatBubbleOvalLeftEllipsis,
    EllipsisHorizontal,
    GlobeAlt,
    Icon,
    Link,
    MapPin,
    Share,
    ShieldCheck,
  } from 'svelte-hero-icons/dist'
  import { PostVote } from '..'
  import { PostFormState } from '../form/postform.svelte'
  import { postLink } from '../helpers'

  let saving = $state(false)
  let editing = $state(false)

  interface Props {
    post: PostView
    view?: View
    debug?: boolean
    style?: string
    onedit?: (post: PostView) => void
    onhide?: (hide: boolean) => void
  }

  let {
    post = $bindable(),
    view = 'cozy',
    debug = $bindable(false),
    style = '',
    onedit,
    onhide,
  }: Props = $props()
  let buttonHeight = $derived(view == 'compact' ? 'h-7.5' : 'h-8')
  let buttonSquare = $derived(view == 'compact' ? 'w-7.5 h-7.5' : 'w-8 h-8')

  function share(global: boolean = true, url?: string) {
    const link =
      url ??
      (global
        ? post.post.ap_id
        : `${instanceToURL(profile.current.instance)}/post/${post.post.id}`)

    if (navigator.share)
      navigator.share?.({
        url: link,
      })
    else {
      navigator.clipboard.writeText(link)
      toast({ content: $t('toast.copied') })
    }
  }
</script>

{#if editing}
  <Modal bind:open={editing}>
    {#snippet customTitle()}
      <h1 class="text-2xl font-bold">{$t('form.edit')}</h1>
    {/snippet}
    {#await import('../form/PostForm.svelte')}
      <div class="mx-auto h-96 flex justify-center items-center">
        <Spinner width={32} />
      </div>
    {:then { default: PostForm }}
      <PostForm
        editPost={post.post.id}
        onsubmit={(e) => {
          editing = false
          post = e
          onedit?.(e)
        }}
        init={new PostFormState({
          type: post.post.poll ? 'poll' : post.post.event ? 'event' : 'normal',
          ...post.post,
        })}
      >
        {#snippet title()}{/snippet}
      </PostForm>
    {/await}
  </Modal>
{/if}

<footer
  class={[
    'flex flex-row gap-2 items-center shrink-0 text-slate-600 dark:text-zinc-400',
    buttonHeight,
  ]}
  class:flex-row-reverse={settings.posts.reverseActions}
  {style}
>
  <PostVote
    post={post.post}
    bind:vote={post.my_vote}
    bind:score={post.counts.score}
    bind:upvotes={post.counts.upvotes}
    bind:downvotes={post.counts.downvotes}
  />

  <Button
    size="custom"
    href="{postLink(post.post)}#comments"
    class="text-inherit! h-full px-3 relative"
    rounding="xl"
    target={settings.openLinksInNewTab ? '_blank' : ''}
    aria-label={$t('post.actions.comments')}
  >
    {@const newComment =
      publishedToDate(post.counts.newest_comment_time).getTime() >
      new Date().getTime() - 5 * 60 * 1000}
    <Icon
      src={newComment ? ChatBubbleOvalLeftEllipsis : ChatBubbleOvalLeft}
      size="16"
      mini
    />
    <FormattedNumber number={post.counts.comments} />
  </Button>
  <div class="flex-1"></div>

  {#if settings.debugInfo}
    {#if debug}
      {#await import('$lib/ui/util/debug/DebugObject.svelte') then { default: DebugObject }}
        <DebugObject object={post} bind:open={debug} />
      {/await}
    {/if}
    <Button
      onclick={() => (debug = true)}
      title="Debug"
      size="custom"
      rounding="xl"
      class={buttonSquare}
      icon={BugAnt}
    ></Button>
  {/if}
  {#if profile.isMod(post.community) || profile.isAdmin}
    {#await import('$lib/feature/moderation/ModerationMenu.svelte') then { default: ModerationMenu }}
      <ModerationMenu bind:item={post}>
        {#snippet target(attachment, acting)}
          <Button
            {@attach attachment}
            size="custom"
            rounding="xl"
            loading={acting}
            class={buttonSquare}
          >
            <Icon src={ShieldCheck} size="18" mini />
          </Button>
        {/snippet}
      </ModerationMenu>
    {/await}
  {/if}

  {#if profile.current?.jwt}
    <Button
      onclick={async () => {
        if (!profile.current?.jwt) return
        saving = true
        post.saved = await save(post, !post.saved)
        saving = false
      }}
      size="custom"
      class={buttonSquare}
      rounding="xl"
      loading={saving}
      disabled={saving}
      title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
      icon={post.saved ? BookmarkSlash : Bookmark}
    ></Button>
  {/if}

  <Menu placement="bottom-end">
    {#snippet target(attachment)}
      <Button
        {@attach post.post.local ? () => {} : attachment}
        rounding="xl"
        size="custom"
        class={buttonSquare}
        onclick={() => {
          if (post.post.local) share()
        }}
        icon={Share}
        title={$t('post.actions.more.share')}
      />
    {/snippet}
    <MenuDivider showLabel>{$t('post.actions.more.share.from')}</MenuDivider>
    <MenuButton onclick={() => share(true)} icon={GlobeAlt}>
      {$t('post.actions.more.share.global')}
    </MenuButton>
    <MenuButton onclick={() => share(false)} icon={MapPin}>
      {$t('post.actions.more.share.local')}
    </MenuButton>
    {#if !LINKED_INSTANCE_URL || post.post.url}
      <MenuDivider>
        <svelte:fragment></svelte:fragment>
      </MenuDivider>
    {/if}
    {#if !LINKED_INSTANCE_URL}
      <MenuButton
        onclick={() =>
          share(
            false,
            new URL(`/go/${post.post.ap_id}`, page.url.origin).toString(),
          )}
        icon={Photon}
      >
        {$t('post.actions.more.share.photon')}
      </MenuButton>
    {/if}
    {#if post.post.url}
      <MenuButton onclick={() => share(false, post.post.url)} icon={Link}>
        {$t('post.actions.more.share.url')}
      </MenuButton>
    {/if}
  </Menu>

  {#if profile.current.jwt}
    <Menu placement="bottom-end">
      {#snippet target(popover)}
        <Button
          {@attach popover}
          title={$t('post.actions.more.label')}
          rounding="xl"
          size="custom"
          class={buttonSquare}
          icon={EllipsisHorizontal}
        ></Button>
      {/snippet}
      {#snippet children(open)}
        {#if open}
          {#await import('./PostActionsMenu.svelte')}
            <div class="p-8 w-full h-full grid place-items-center">
              <Spinner width={20} />
            </div>
          {:then { default: PostActionsMenu }}
            <PostActionsMenu bind:post {onhide} bind:editing />
          {/await}
        {/if}
      {/snippet}
    </Menu>
  {/if}
</footer>
