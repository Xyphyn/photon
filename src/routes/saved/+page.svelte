<script lang="ts">
  import type { CommentView, PostView } from 'lemmy-js-client'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import { fly } from 'svelte/transition'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { Button, Material } from 'mono-svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import { userSettings } from '$lib/settings.js'

  export let data

  const isComment = (item: CommentView | PostView): item is CommentView =>
    'comment' in item
</script>

<svelte:head>
  <title>Saved</title>
</svelte:head>

<h1 class="text-2xl font-bold">Saved</h1>
<div
  class="flex flex-col list-none my-4 divide-slate-200 dark:divide-zinc-800"
  class:gap-4={$userSettings.view == 'card'}
  class:!divide-y={$userSettings.view != 'card'}
>
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <p class="text-center opacity-60 text-lg mx-4">
      Wow, it's quite empty in here.
    </p>
  {:else}
    {#each data.data as item, index}
      <div in:fly={{ opacity: 0, y: -4, delay: index * 50 }}>
        {#if isComment(item)}
          <CommentItem comment={item} />
        {:else}
          <Post post={item} />
        {/if}
      </div>
    {/each}
  {/if}
</div>
