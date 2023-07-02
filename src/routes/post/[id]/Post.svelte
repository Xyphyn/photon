<script lang="ts">
  import type {
    CommentView,
    GetPostResponse,
    PostView,
    Comment,
  } from 'lemmy-js-client'
  import {
    ArrowDown,
    ArrowUp,
    ChatBubbleLeft,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import type { CommentNodeI } from './comments.js'
  import RelativeDate from '$lib/components/RelativeDate.svelte'
  import CommunityLink from '$lib/components/CommunityLink.svelte'
  import { isImage } from '$lib/ui/image.js'

  let postRes: PostView
  export { postRes as post }
</script>

<div
  class="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-slate-200
    rounded-md flex flex-col overflow-hidden max-w-xl w-full"
>
  <div class="flex flex-col gap-2 bg-white dark:bg-zinc-900 p-4 rounded-md">
    <span class="flex flex-row gap-2 text-sm opacity-70">
      <CommunityLink community={postRes.community} />
      <span class="opacity-50">{postRes.creator.name}</span>
      <span class="opacity-50">
        <RelativeDate date={new Date(postRes.post.published)} />
      </span>
    </span>
    <a href="/post/{postRes.post.id}" class="font-bold text-lg">
      {postRes.post.name}
    </a>
    {#if postRes.post.url}
      <a
        href={postRes.post.url}
        class="text-sky-400 max-w-[24ch] overflow-hidden
                whitespace-nowrap text-ellipsis text-xs hover:underline"
      >
        {postRes.post.url}
      </a>
    {/if}
    {#if isImage(postRes.post.url)}
      <a href="/post/{postRes.post.id}" class="inline self-start">
        <img
          src={postRes.post.url}
          alt={postRes.post.name}
          class="rounded-md max-h-64 max-w-full"
          loading="lazy"
        />
      </a>
    {/if}
    {#if postRes.post.body}
      <p class="text-sm max-h-24 line-clamp-3">
        {postRes.post.body}
      </p>
    {/if}
  </div>
  <div class="flex flex-row gap-2 p-2">
    <div
      class="flex flex-row items-center gap-1 rounded-md
            bg-slate-100 dark:bg-zinc-800"
    >
      <button aria-label="Upvote" class="p-1 px-1.5">
        <Icon src={ChevronUp} mini width={20} height={20} />
      </button>
      <span class="text-sm">
        {Intl.NumberFormat('en', { notation: 'compact' }).format(
          postRes.counts.score
        )}
      </span>
      <button aria-label="Downvote" class="p-1 px-1.5">
        <Icon src={ChevronDown} mini width={20} height="20}" />
      </button>
    </div>

    <a
      class="flex flex-row items-center gap-2.5 p-1 px-2 rounded-md
            bg-slate-100 dark:bg-zinc-800"
      href="/post/{postRes.post.id}"
    >
      <Icon src={ChatBubbleLeft} width={16} height={16} />
      <span class="text-sm">
        {Intl.NumberFormat('en', { notation: 'compact' }).format(
          postRes.counts.comments
        )}
      </span>
    </a>
  </div>
</div>
