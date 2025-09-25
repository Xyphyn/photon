<script lang="ts">
  import { profile } from '$lib/app/auth.svelte.js'
  import { amMod, isAdmin } from '$comp/lemmy/moderation/moderation.js'
  import { publishedToDate } from '$comp/util/date'
  import FormattedNumber from '$comp/util/FormattedNumber.svelte'
  import { t } from '$lib/app/i18n'
  import { save } from '$lib/lemmy/contentview.js'
  import { settings, type View } from '$lib/settings.svelte.js'
  import type { PostView } from '$lib/api/types'
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
  import { PostVote } from '..'

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
</script>

{#if editing}
  <Modal bind:open={editing}>
    {#snippet customTitle()}
      <h1 class="text-2xl font-bold">{$t('form.edit')}</h1>
    {/snippet}
    {#await import('../PostForm.svelte')}
      <div class="mx-auto h-96 flex justify-center items-center">
        <Spinner width={32} />
      </div>
    {:then { default: PostForm }}
      <PostForm
        edit
        editingPost={post.post}
        onsubmit={(e) => {
          editing = false
          post = e
          onedit?.(e)
        }}
        passedData={{
          body: post.post.body,
          title: post.post.name,
          community: null,
          flair_list: post.flair_list?.map((i) => i.id) ?? [],
          image: null,
          loading: false,
          nsfw: post.post.nsfw,
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
    color="ghost"
    rounding="pill"
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
      color="ghost"
      rounding="pill"
      class={buttonSquare}
      icon={BugAnt}
    ></Button>
  {/if}
  {#if profile.current?.user && (amMod(profile.current.user, post.community) || isAdmin(profile.current.user))}
    {#await import('$comp/lemmy/moderation/ModerationMenu.svelte') then { default: ModerationMenu }}
      <ModerationMenu bind:item={post}>
        {#snippet target(attachment, acting)}
          <Button
            {@attach attachment}
            size="custom"
            color="ghost"
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
      color="ghost"
      rounding="pill"
      loading={saving}
      disabled={saving}
      title={post.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
      icon={post.saved ? BookmarkSlash : Bookmark}
    ></Button>
  {/if}

  <Menu placement="bottom-end">
    {#snippet target(popover)}
      <Button
        {@attach popover}
        title={$t('post.actions.more.label')}
        color="ghost"
        rounding="pill"
        size="custom"
        class={buttonSquare}
        icon={EllipsisHorizontal}
      ></Button>
    {/snippet}
    {#snippet children(open)}
      {#if open}
        {#await import ('./PostActionsMenu.svelte')}
          <div class="p-8 w-full h-full grid place-items-center">
            <Spinner width={20} />
          </div>
        {:then { default: PostActionsMenu }}
          <PostActionsMenu bind:post {onhide} bind:editing />
        {/await}
      {/if}
    {/snippet}
  </Menu>
</footer>
