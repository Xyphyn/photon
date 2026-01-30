<script lang="ts">
  import { page } from '$app/state'
  import { getClient } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Button, Modal, toast } from 'mono-svelte'
  import RelativeDate, {
    formatRelativeDate,
  } from 'mono-svelte/util/RelativeDate.svelte'
  import {
    Bookmark,
    Icon,
    Microphone,
    Minus,
    Pencil,
    Plus,
    ShieldCheck,
    Trash,
  } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import type { ClassValue } from 'svelte/elements'
  import { slide } from 'svelte/transition'
  import UserLink from '../user/UserLink.svelte'
  import CommentActions from './CommentActions.svelte'
  import CommentForm from './CommentForm.svelte'
  import type { CommentNodeI } from './comments.svelte'

  interface Props {
    node: CommentNodeI
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
      onsubmit={(e) => {
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
    {@const creatorIsOp =
      node.comment_view.creator.id == node.comment_view.post.creator_id}
    <label
      for="comment-expand-{node.comment_view.comment.id}"
      class="flex flex-row cursor-pointer gap-2 items-center group text-sm flex-wrap w-full z-0 group relative"
    >
      <div
        class={[
          'absolute -inset-0.5 right-1 group-hover:right-0 group-hover:-inset-1.5 opacity-0 group-hover:opacity-100 transition-all',
          'bg-slate-100 dark:bg-zinc-900 -z-10 rounded-full inline-flex items-center justify-end',
        ]}
      >
        {#if node.comment_view.counts.child_count > 0}
          {@const children = node.comment_view.counts.child_count}
          <div
            aria-label={$t('aria.comments.children', { childCount: children })}
            class="font-medium"
          >
            {children}
          </div>
        {/if}
        <div
          class={[
            !open && 'rotate-90',
            'transition-all duration-500 ease-out my-auto h-full w-8 grid place-items-center',
          ]}
        >
          <Icon src={open ? Minus : Plus} size="16" micro />
        </div>
      </div>
      {@render metaSuffix?.()}
      <span
        class={[
          'flex flex-row gap-1 items-center',
          creatorIsOp && 'text-blue-600 dark:text-blue-400 font-bold',
        ]}
      >
        <UserLink
          inComment
          avatarSize={20}
          avatar
          user={node.comment_view.creator}
        >
          {#snippet extraBadges()}
            {#if node.comment_view.creator_is_moderator}
              <Icon
                src={ShieldCheck}
                size="16"
                micro
                class="text-green-500"
                aria-label={$t('class.moderator')}
              />
            {/if}
            {#if node.comment_view.creator_is_admin}
              <Icon
                src={ShieldCheck}
                size="16"
                micro
                class="text-red-500"
                aria-label={$t('class.admin')}
              />
            {/if}
          {/snippet}
        </UserLink>
        {#if creatorIsOp}
          <Icon
            mini
            size="16"
            src={Microphone}
            class="text-blue-500 dark:text-blue-400"
          />
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
    class="appearance-none absolute top-0 left-0 h-8 w-full pointer-events-none comment-expand"
    type="checkbox"
    id="comment-expand-{node.comment_view.comment.id}"
    bind:checked={open}
  />
  <div class={['expand max-w-full', contentClass]} inert={!open}>
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
            'text-[15px] font-reading sm:text-base text-slate-700 dark:text-zinc-300 *:leading-[1.6] wrap-break-word space-y-3',
            node.comment_view.comment.distinguished
              ? 'material-success px-3 py-1.5 rounded-xl max-w-max'
              : page.url.hash.slice(1) ==
                  node.comment_view.comment.id.toString() &&
                'material-info px-3 py-1.5 rounded-xl max-w-max',
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
            postId={node.comment_view.post.id}
            parentId={node.comment_view.comment.id}
            oncomment={(e) => {
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
