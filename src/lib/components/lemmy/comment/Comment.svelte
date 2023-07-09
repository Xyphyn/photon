<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    ChatBubbleOvalLeft,
    ChevronDown,
    ChevronUp,
    Icon,
    Minus,
    Plus,
  } from 'svelte-hero-icons'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import type { CommentNodeI } from './comments'
  import SvelteMarkdown from 'svelte-markdown'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { getClient, authData } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import CommentForm from './CommentForm.svelte'
  import { page } from '$app/stores'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import CommentVote from '$lib/components/lemmy/comment/CommentVote.svelte'
  import Button from '$lib/components/input/Button.svelte'

  export let node: CommentNodeI
  export let postId: number
  export let op: boolean = false

  export let open = true
  export let replying = false
</script>

<li
  class="py-2 {$page.url.hash == `#${node.comment_view.comment.id}`
    ? 'bg-slate-200 dark:bg-zinc-800'
    : ''} {node.depth == 0
    ? 'border-b border-slate-200 dark:border-zinc-800'
    : ''}"
  id="#{node.comment_view.comment.id.toString()}"
>
  <details bind:open class="flex flex-col gap-1">
    <summary
      class="flex flex-row cursor-pointer arrow gap-2 items-center group text-xs"
    >
      <span class:font-bold={op} class="flex flex-row gap-1 items-center">
        <UserLink avatarSize={20} avatar user={node.comment_view.creator} />
        {#if op}
          <span class="text-sky-500">OP</span>
        {/if}
      </span>
      <span class="opacity-60">
        <RelativeDate date={new Date(node.comment_view.comment.published)} />
      </span>
      <span
        class="ml-auto translate-x-1 opacity-0
        group-hover:translate-x-0 group-hover:opacity-100 text-xs transition-all
        flex flex-row items-center gap-1 dark:bg-zinc-900 p-1 rounded-md
        bg-slate-200 hover:brightness-125 px-2"
      >
        {#if open}
          <Icon src={Minus} width={16} height={16} mini />
        {:else}
          <Icon src={Plus} width={16} height={16} mini />
          {#if node.children.length > 0}
            <span class="text-xs opacity-50">+{node.children.length}</span>
          {/if}
        {/if}
      </span>
    </summary>
    <div
      class="flex flex-col gap-1 whitespace-pre-wrap
      max-w-full"
    >
      <div class="max-w-full break-words text-sm leading-6">
        <Markdown source={node.comment_view.comment.content} />
      </div>
      <div class="flex flex-row gap-2 items-center mt-1 h-[26px]">
        <CommentVote
          bind:score={node.comment_view.counts.score}
          bind:vote={node.comment_view.my_vote}
          commentId={node.comment_view.comment.id}
        />
        <button
          class="{Color.borderDark} h-full px-2 flex flex-row items-center gap-1
          rounded-md transition-colors"
          on:click={() => (replying = !replying)}
        >
          <Icon src={ChatBubbleOvalLeft} width={16} height={16} mini />
          <span class="text-xs">Reply</span>
        </button>
      </div>
    </div>
    {#if replying}
      <div class="max-w-sm my-2">
        <h1 class="font-bold text-sm mb-2">Reply</h1>
        <CommentForm
          {postId}
          parentId={node.comment_view.comment.id}
          on:comment={(e) => {
            node.children = [
              {
                children: [],
                depth: node.depth,
                comment_view: e.detail.comment_view,
              },
              ...node.children,
            ]
            replying = false
          }}
        />
      </div>
    {/if}
    <div class="bg-transparent dark:bg-transparent">
      <slot />
    </div>
  </details>
</li>
