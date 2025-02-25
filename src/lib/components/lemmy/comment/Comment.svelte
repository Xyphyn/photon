<script lang="ts">
  import {
    ArrowUp,
    Bookmark,
    Icon,
    Microphone,
    Minus,
    Pencil,
    Plus,
    Trash,
    PlusCircle,
    MinusCircle,
  } from 'svelte-hero-icons'
  import type { CommentNodeI } from './comments'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import CommentForm from './CommentForm.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import CommentActions from '$lib/components/lemmy/comment/CommentActions.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { Disclosure, toast } from 'mono-svelte'
  import { profile } from '$lib/auth.js'
  import { Button, Modal } from 'mono-svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { t } from '$lib/translations'
  import { fly, slide } from 'svelte/transition'
  import { expoInOut, expoOut } from 'svelte/easing'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'

  export let node: CommentNodeI
  export let postId: number
  export let op: boolean = false

  export let actions: boolean = true
  export let meta: boolean = true

  export let open = true

  export let replying = false

  let editing = false
  let newComment = node.comment_view.comment.content

  let editingLoad = false

  async function save() {
    if (!$profile?.jwt || newComment.length <= 0) return

    editingLoad = true

    try {
      await getClient().editComment({
        comment_id: node.comment_view.comment.id,
        content: newComment,
      })

      node.comment_view.comment.content = newComment

      editing = false
    } catch (err) {
      toast({
        // @ts-ignore i hate this
        content: err,
        type: 'error',
      })
    }

    editingLoad = false
  }

  onMount(() => {
    if ('#' + node.comment_view.comment.id.toString() == $page.url.hash) {
      highlight = 'text-primary-900 dark:text-primary-100 font-medium'

      setTimeout(() => (highlight = 'duration-[3s] transition-all'), 500)
      setTimeout(() => (highlight = ''), 600)
    }
  })

  let highlight = ''
</script>

{#if editing}
  <Modal bind:open={editing}>
    <span slot="title">{$t('form.edit')}</span>
    <form on:submit|preventDefault={save} class="contents">
      <CommentForm
        postId={node.comment_view.comment.id}
        bind:value={newComment}
        actions={false}
        preview={true}
        on:confirm={save}
      />
      <Button
        submit
        color="primary"
        size="lg"
        loading={editingLoad}
        disabled={editingLoad}
        class="w-full"
      >
        {$t('common.save')}
      </Button>
    </form>
  </Modal>
{/if}

<li
  class="py-3 relative {node.comment_view.comment.distinguished
    ? ' text-primary-900 dark:text-primary-100'
    : ''} {highlight} {$$props.class}"
  id={node.comment_view.comment.id.toString()}
>
  {#if meta}
    <button
      on:click={() => (open = !open)}
      class="flex flex-row cursor-pointer gap-2 items-center group text-[13px] flex-wrap w-full
    z-0 group relative"
    >
      <slot name="meta-suffix" />
      <div
        class="absolute opacity-0 -z-10 inset-0 group-hover:block group-hover:opacity-100
      bg-slate-100 dark:bg-zinc-900 group-hover:-inset-1 group-hover:-inset-x-2 rounded-full transition-all
"
      >
        <div
          class="h-full flex items-center justify-center gap-1 ml-auto w-max mr-2"
        >
          {#if node.children.length > 0}
            <FormattedNumber number={node.comment_view.counts.child_count}
            ></FormattedNumber>
          {/if}
          <Icon
            src={open ? Minus : Plus}
            size="16"
            micro
            class="transition-transform duration-[400ms] ease-out {open
              ? ''
              : 'rotate-90'} text-primary-900 dark:text-primary-100"
          />
        </div>
      </div>
      <span class:font-bold={op} class="flex flex-row gap-1 items-center">
        <UserLink
          inComment
          avatarSize={24}
          avatar
          user={node.comment_view.creator}
        >
          <svelte:fragment slot="badges">
            {#if node.comment_view.creator_is_moderator}
              <ShieldIcon filled width={14} class="text-green-500" />
            {/if}
            {#if node.comment_view.creator_is_admin}
              <ShieldIcon filled width={14} class="text-red-500" />
            {/if}
          </svelte:fragment>
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
  {#if open}
    <div
      class="relative {$$props.contentClass}"
      transition:slide={{ duration: 400, easing: expoOut }}
    >
      <div
        class="flex flex-col whitespace-pre-wrap
      max-w-full gap-1 mt-1 relative"
      >
        {#if node.comment_view.comment.distinguished}
          <div
            class="-z-10 bg-slate-100 dark:bg-zinc-900 absolute -top-9 -bottom-1.5
          -inset-x-6 -right-6"
          />
        {/if}
        <div
          class="max-w-full mt-0.5 break-words text-[15px] text-slate-800 dark:text-zinc-100"
        >
          <Markdown source={node.comment_view.comment.content} />
        </div>
        {#if actions}
          <CommentActions
            bind:comment={node.comment_view}
            bind:replying
            on:edit={() => (editing = true)}
            disabled={node.comment_view.banned_from_community ||
              node.comment_view.post.locked}
          />
        {/if}
      </div>
      {#if replying}
        <div
          class="max-w-full my-2 border-l border-slate-200 dark:border-zinc-800 pl-4"
          transition:slide={{ axis: 'y', duration: 400, easing: expoOut }}
        >
          <div in:fly={{ duration: 500, y: -16, easing: expoOut, delay: 200 }}>
            <CommentForm
              label={$t('comment.reply')}
              {postId}
              parentId={node.comment_view.comment.id}
              on:comment={(e) => {
                node.children = [
                  {
                    children: [],
                    comment_view: e.detail.comment_view,
                    depth: node.depth + 1,
                    ui: {},
                  },
                  ...node.children,
                ]
                replying = false
              }}
              on:cancel={() => (replying = false)}
            />
          </div>
        </div>
      {/if}
      <div class="bg-transparent dark:bg-transparent">
        <slot />
      </div>
    </div>
  {/if}
</li>
