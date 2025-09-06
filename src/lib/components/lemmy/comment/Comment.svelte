<script lang="ts">
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import CommentActions from '$lib/components/lemmy/comment/CommentActions.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import RelativeDate, {
    formatRelativeDate,
  } from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { settings } from '$lib/settings.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import {
    Bookmark,
    Icon,
    Microphone,
    Minus,
    Pencil,
    Plus,
    Trash,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import type { ClassValue } from 'svelte/elements'
  import { slide } from 'svelte/transition'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import CommentForm from './CommentForm.svelte'
  import type { CommentNodeI } from './comments.svelte'

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
    open = $bindable(true),
    contentClass = '',
    class: clazz = '',
    metaSuffix,
    children,
  }: Props = $props()

  let editing = $state(false)
  let newComment = $state(node.comment_view.comment.content)
  let editingLoad = $state(false)

  async function save(type: 'reply' | 'edit') {
    if (!profile.current?.jwt || newComment.length <= 0) return

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
</script>

{#if editing}
  <Modal bind:open={editing}>
    {#snippet customTitle()}
      <div>{$t('form.edit')}</div>
    {/snippet}
    <form
      onsubmit={e => {
        e.preventDefault()
        save(replying ? 'reply' : 'edit')
      }}
      class="contents"
    >
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
    </form>
  </Modal>
{/if}

<li
  class={['py-3 relative', clazz]}
  id={node.comment_view.comment.id.toString()}
>
  {#if meta}
    <label
      for="comment-expand-{node.comment_view.comment.id}"
      class="flex flex-row cursor-pointer gap-2 items-center group text-sm flex-wrap w-full z-0 group relative"
    >
      <div
        class={[
          'absolute -inset-0.5 right-1 group-hover:right-0 group-hover:-inset-1.5 opacity-0 group-hover:opacity-100 transition-all',
          'bg-slate-100 dark:bg-zinc-900 -z-10 rounded-full',
        ]}
      >
        <div
          class={[
            !open && 'rotate-90',
            'transition-all duration-500 ease-out ml-auto my-auto h-full w-8 grid place-items-center',
          ]}
        >
          <Icon src={open ? Minus : Plus} size="16" micro />
        </div>
      </div>
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
        {#if node.comment_view.comment.updated}{@const edited = $t(
            'post.meta.lastEdited',
            {
              default: formatRelativeDate(
                publishedToDate(node.comment_view.comment.updated),
                {
                  style: 'long',
                },
              ),
            },
          )}
          <div title={edited}>
            <Icon src={Pencil} micro size="14" />
          </div>
        {/if}
        {#if node.comment_view.comment.deleted}
          <Icon
            src={Trash}
            solid
            size="12"
            aria-label={$t('post.badges.deleted')}
            class="text-red-600 dark:text-red-500"
          />
        {/if}
        {#if node.comment_view.comment.removed}
          <Icon
            src={Trash}
            solid
            size="12"
            aria-label={$t('post.badges.removed')}
            class="text-green-600 dark:text-green-500"
          />
        {/if}
        {#if node.comment_view.saved}
          <Icon
            src={Bookmark}
            solid
            size="12"
            aria-label={$t('post.badges.saved')}
            class="text-yellow-600 dark:text-yellow-500"
          />
        {/if}
      </span>
      {#if settings.debugInfo}
        <span class="text-slate-600 dark:text-zinc-400 font-mono ml-auto">
          #{node.comment_view.comment.id}
        </span>
      {/if}
    </label>
  {/if}
  <input
    class="hidden comment-expand"
    type="checkbox"
    id="comment-expand-{node.comment_view.comment.id}"
    bind:checked={open}
  />
  <div class={['expand max-w-full', contentClass]}>
    <div id="comment-content">
      <div
        class={[
          'flex flex-col whitespace-pre-wrap max-w-full gap-1 mt-1 relative w-full',
        ]}
      >
        <Markdown
          source={node.comment_view.comment.content}
          noStyle
          class={[
            'text-[15px] sm:text-base text-slate-700 dark:text-zinc-300 *:leading-[1.6] break-words space-y-3',
            node.comment_view.comment.distinguished
              ? 'bg-green-400/10 p-2 rounded-xl max-w-max font-medium'
              : page.url.hash.slice(1) ==
                  node.comment_view.comment.id.toString() &&
                'bg-slate-100 dark:bg-zinc-900 p-2 rounded-xl max-w-max',
          ]}
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

      {#if replying}
        <div transition:slide={{ duration: 600, easing: expoOut }}>
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
        </div>
      {/if}
      {@render children?.()}
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

  .comment-expand:checked + .expand {
    grid-template-rows: 1fr;
  }

  .expand > * {
    min-height: 0;
  }
</style>
