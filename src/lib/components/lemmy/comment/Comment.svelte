<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    ChatBubbleOvalLeft,
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

  export let node: CommentNodeI
  export let postId: number
  export let op: boolean = false

  export let open = true
  export let replying = false

  let score = node.comment_view.counts.score
  let vote = node.comment_view.my_vote ?? 0

  async function upvote() {
    if (!$authData) return

    const upvoted = node.comment_view.my_vote == 1

    if (vote == -1) {
      score += 2
    } else if (vote == 1) {
      score -= 1
    } else if (vote == 0) {
      score += 1
    }

    vote = Number(!upvoted)
    node.comment_view.my_vote = Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : 1,
        auth: $authData.token,
        comment_id: node.comment_view.comment.id,
      })
      .catch((_) => undefined)
  }

  async function downvote() {
    if (!$authData) return

    const upvoted = node.comment_view.my_vote == -1

    if (vote == -1) {
      score += 1
    } else if (vote == 1) {
      score -= 2
    } else if (vote == 0) {
      score -= 1
    }

    vote = -Number(!upvoted)
    node.comment_view.my_vote = -Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : -1,
        auth: $authData.token,
        comment_id: node.comment_view.comment.id,
      })
      .catch((_) => undefined)
  }
</script>

<li
  class="py-2 {$page.url.hash == `#${node.comment_view.comment.id}`
    ? 'bg-slate-200 dark:bg-zinc-800'
    : ''} {node.depth == 0
    ? 'border-b border-slate-200 dark:border-white/10'
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
        flex flex-row items-center gap-1 dark:bg-white/5 p-1 rounded-md
        bg-black/5 px-2"
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
      <div class="flex flex-row gap-2 items-center">
        <div class="flex flex-row items-center">
          <button
            on:click={upvote}
            class="pr-1.5 {node.comment_view.my_vote == 1
              ? 'text-orange-500'
              : ''}"
          >
            <Icon src={ArrowUp} width={16} mini />
          </button>
          <span class="text-sm font-medium">
            {score}
          </span>
          <button
            on:click={downvote}
            class="pl-1.5 {node.comment_view.my_vote == -1
              ? 'text-blue-500'
              : ''}"
          >
            <Icon src={ArrowDown} width={16} mini />
          </button>
        </div>
        <button
          class="flex flex-row gap-1 items-center transition-colors px-2 py-1
            rounded-md {Color.secondary}"
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
