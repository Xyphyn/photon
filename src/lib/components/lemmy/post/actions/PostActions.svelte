<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import {
    amMod,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import { publishedToDate } from '$lib/components/util/date'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations'
  import { save } from '$lib/lemmy/contentview.js'
  import { settings, type View } from '$lib/settings.svelte.js'
  import type { PostView } from 'lemmy-js-client'
  import { Button, Menu, Modal, Spinner } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    BugAnt,
    ChatBubbleOvalLeft,
    ChatBubbleOvalLeftEllipsis,
    EllipsisHorizontal,
    Icon,
    ShieldCheck,
  } from 'svelte-hero-icons'
  import { postLink } from '../helpers'
  import PostVote from '../PostVote.svelte'

  let saving = $state(false)
  let editing = $state(false)

  interface Props {
    post: PostView
    view?: View
    debug?: boolean
    style?: string
    onedit?: (post: PostView) => void
    onhide?: (hide: boolean) => void
    voteComponent?: { castVote: (vote: number) => void }
  }

  let {
    post = $bindable(),
    view = 'cozy',
    debug = $bindable(false),
    style = '',
    voteComponent = $bindable(),
    onedit,
    onhide,
  }: Props = $props()
  let buttonHeight = $derived(view == 'compact' ? 'h-7' : 'h-8')
  let buttonSquare = $derived(view == 'compact' ? 'w-7 h-7' : 'w-8 h-8')
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
        edit
        editingPost={post.post}
        onsubmit={e => {
          editing = false
          post = e
          onedit?.(e)
        }}
      >
        {#snippet formtitle()}
          <!-- Have the title not exist at all -->
        {/snippet}
      </PostForm>
    {/await}
  </Modal>
{/if}

<footer
  class={[
    'flex flex-row gap-2 items-center shrink-0 text-slate-600 dark:text-zinc-300',
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
    bind:this={voteComponent}
    showCounts={profile.current?.user?.local_user_view?.local_user
      ?.show_scores ?? true}
  />

  <Button
    size="custom"
    href="{postLink(post.post)}#comments"
    class="text-inherit! h-full px-3 relative"
    color="secondary"
    rounding="pill"
    target={settings.openLinksInNewTab ? '_blank' : ''}
    title={$t('post.actions.comments')}
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
  <div class="flex-1"></div>
  {#if settings.debugInfo}
    {#if debug}
      {#await import('$lib/components/util/debug/DebugObject.svelte') then { default: DebugObject }}
        <DebugObject object={post} bind:open={debug} />
      {/await}
    {/if}
    <Button
      onclick={() => (debug = true)}
      title="Debug"
      size="custom"
      color="secondary"
      rounding="pill"
      class={buttonSquare}
      animations={{ scale: true, large: true }}
    >
      {#snippet prefix()}
        <Icon src={BugAnt} micro size="16" />
      {/snippet}
    </Button>
  {/if}
  {#if profile.current?.user && (amMod(profile.current.user, post.community) || isAdmin(profile.current.user))}
    {#await import('$lib/components/lemmy/moderation/ModerationMenu.svelte') then { default: ModerationMenu }}
      <ModerationMenu bind:item={post}>
        {#snippet target(acting)}
          <Button
            size="custom"
            color="secondary"
            rounding="pill"
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
      color="secondary"
      rounding="pill"
      loading={saving}
      disabled={saving}
      title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
    >
      {#snippet prefix()}
        <Icon src={post.saved ? BookmarkSlash : Bookmark} size="16" mini />
      {/snippet}
    </Button>
  {/if}

  <Menu placement="bottom-end">
    {#snippet target()}
      <Button
        title={$t('post.actions.more.label')}
        color="secondary"
        rounding="pill"
        size="custom"
        class={buttonSquare}
        animations={{ scale: true, large: true }}
      >
        {#snippet prefix()}
          <Icon src={EllipsisHorizontal} size="16" micro />
        {/snippet}
      </Button>
    {/snippet}
    {#snippet children(open)}
      {#if open}
        {#await import('./PostActionsMenu.svelte') then { default: PostActionsMenu }}
          <PostActionsMenu {post} {onhide} bind:editing />
        {/await}
      {/if}
    {/snippet}
  </Menu>
</footer>
