<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import CommentActions from '$lib/components/lemmy/comment/CommentActions.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { errorMessage } from '$lib/lemmy/error'
  import { Button, Material, Modal, toast } from 'mono-svelte'
  import { Bookmark, Icon, Microphone, Pencil, Trash } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import CommentForm from './CommentForm.svelte'
  import type { CommentNodeI } from './comments.svelte'
  import CommentItem from './CommentItem.svelte'

  interface Props {
    node: CommentNodeI
    postId: number
    op?: boolean
    actions?: boolean
    meta?: boolean
    open?: boolean
    replying?: boolean
    contentClass?: ClassValue
    class?: ClassValue
    metaSuffix?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    node = $bindable(),
    postId,
    op = false,
    actions = true,
    meta = true,
    replying = $bindable(false),
    contentClass = '',
    class: clazz = '',
    metaSuffix,
    children,
    open = $bindable(true),
  }: Props = $props()

  let editing = $state(false)
  let newComment = $state(node.comment_view.comment.content)
  let editingLoad = $state(false)

  async function save(type: 'reply' | 'edit') {
    if (!profile.data?.jwt || newComment.length <= 0) return

    editingLoad = true

    try {
      if (type == 'edit') {
        await getClient().editComment({
          comment_id: node.comment_view.comment.id,
          content: newComment,
        })

        node.comment_view.comment.content = newComment

        editing = false
      }
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    editingLoad = false
  }

  $effect(() => {
    if (!open) {
      // const
    }
  })

  setTimeout(() => {
    open = true
  }, 500)
</script>

{#if editing || replying}
  <Modal
    bind:open={
      () => replying || editing,
      v => {
        replying = v
        editing = v
      }
    }
  >
    {#snippet customTitle()}
      <div>{replying ? $t('comment.reply') : $t('form.edit')}</div>
    {/snippet}
    {#if replying}
      <Material
        rounding="2xl"
        color="uniform"
        class="max-h-48 overflow-hidden relative"
      >
        <UserLink user={node.comment_view.creator} />

        <CommentItem
          meta={false}
          comment={node.comment_view}
          class="pt-0 text-slate-700 dark:text-zinc-300"
          actions={false}
        />
        <div
          class="bg-gradient-to-b -mx-4 from-white/0 to-white dark:from-zinc-900/0 dark:to-zinc-900 absolute bottom-0 w-full h-24"
        ></div>
      </Material>
    {/if}
    <form
      onsubmit={e => {
        e.preventDefault()
        save(replying ? 'reply' : 'edit')
      }}
      class="contents"
    >
      {#if replying}
        <CommentForm
          label={$t('comment.reply')}
          {postId}
          parentId={node.comment_view.comment.id}
          oncomment={e => {
            node.children = [
              {
                children: [],
                comment_view: e.comment_view,
                depth: node.depth + 1,
                expanded: true,
              },
              ...node.children,
            ]
            replying = false
          }}
          oncancel={() => (replying = false)}
        />
      {:else if editing}
        <CommentForm
          bind:value={newComment}
          postId={node.comment_view.comment.id}
          actions={false}
          preview={true}
        />
        <Button
          submit
          color="primary"
          size="lg"
          loading={editingLoad}
          disabled={editingLoad}
          class="w-full"
        >
          {$t('form.submit')}
        </Button>
      {/if}
    </form>
  </Modal>
{/if}

<li
  class={[
    'py-3 relative',
    node.comment_view.comment.distinguished &&
      ' text-primary-900 dark:text-primary-100',
    clazz,
  ]}
  id={node.comment_view.comment.id.toString()}
>
  {#if meta}
    <button
      onclick={() => (open = !open)}
      class="flex flex-row cursor-pointer gap-2 items-center group text-[13px] flex-wrap w-full
    z-0 group relative"
    >
      {@render metaSuffix?.()}
      <span class:font-bold={op} class="flex flex-row gap-1 items-center">
        <UserLink
          inComment
          avatarSize={20}
          avatar
          user={node.comment_view.creator}
        >
          {#snippet extraBadges()}
            {#if node.comment_view.creator_is_moderator}
              <ShieldIcon filled width={14} class="text-green-500" />
            {/if}
            {#if node.comment_view.creator_is_admin}
              <ShieldIcon filled width={14} class="text-red-500" />
            {/if}
          {/snippet}
        </UserLink>
        {#if op}
          <Icon mini size="16" src={Microphone} class="text-sky-600" />
        {/if}
      </span>
      <RelativeDate
        class="text-slate-600 dark:text-zinc-400"
        date={publishedToDate(node.comment_view.comment.published)}
      />
      <span class="text-slate-600 dark:text-zinc-400 flex flex-row gap-2 ml-1">
        {#if node.comment_view.comment.updated}
          <Icon src={Pencil} solid size="12" title="Edited" />
        {/if}
        {#if node.comment_view.comment.deleted || node.comment_view.comment.removed}
          <Icon
            src={Trash}
            solid
            size="12"
            title={$t('post.badges.deleted')}
            class="text-red-600 dark:text-red-500"
          />
        {/if}
        {#if node.comment_view.saved}
          <Icon
            src={Bookmark}
            solid
            size="12"
            title={$t('post.badges.saved')}
            class="text-yellow-600 dark:text-yellow-500"
          />
        {/if}
      </span>
    </button>
  {/if}
  <div class={['expand max-w-full', open && 'open', contentClass]}>
    <div id="comment-content">
      <div
        class="flex flex-col whitespace-pre-wrap
      max-w-full gap-1 mt-1 relative w-full"
      >
        <Markdown
          source={node.comment_view.comment.content}
          class="text-[15px] text-slate-800 dark:text-zinc-200 leading-[1.3]"
        />
        {#if actions}
          <CommentActions
            comment={node.comment_view}
            bind:replying
            onedit={() => (editing = true)}
            disabled={node.comment_view.banned_from_community ||
              node.comment_view.post.locked}
          />
        {/if}
      </div>
      <div class="bg-transparent dark:bg-transparent">
        {@render children?.()}
      </div>
    </div>
  </div>
</li>

<style>
  .expand {
    display: grid;
    grid-template-rows: 0fr;
    grid-template-columns: 100%;
    overflow: hidden;
    transition: grid-template-rows 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .expand.open {
    grid-template-rows: 1fr;
  }

  .expand > * {
    min-height: 0;
  }
</style>
