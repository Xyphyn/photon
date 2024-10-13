<script lang="ts">
  import type { Post } from 'lemmy-js-client'
  import type { CommentNodeI } from './comments'
  import { createWindowVirtualizer } from '@tanstack/svelte-virtual'
  import Comments from './Comments.svelte'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  export let nodes: CommentNodeI[]
  export let post: Post
  export let scrollTo: string | undefined

  let virtualListEl: HTMLElement | undefined = undefined

  $: virtualizer = createWindowVirtualizer({
    count: nodes.length,
    estimateSize: () => 30,
    scrollMargin: virtualListEl?.offsetTop,
    initialRect: {
      height: 1500,
      width: 99999,
    },
    overscan: 5,
  })

  let virtualItemEls: HTMLElement[] = []

  $: items = $virtualizer.getVirtualItems()

  $: {
    if (virtualItemEls.length)
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
  }
</script>

<div
  style="position:relative; height: {browser
    ? `${$virtualizer.getTotalSize()}px`
    : '100%'}; width: 100%;"
  bind:this={virtualListEl}
>
  <div
    style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({items?.[0]
      ? items?.[0]?.start - $virtualizer.options.scrollMargin
      : 0}px);"
    class="divide-y divide-slate-200 dark:divide-zinc-800"
    id="feed"
  >
    {#each items as row, index (row.index)}
      <div bind:this={virtualItemEls[index]} data-index={row.index}>
        <Comments isParent={true} nodes={[nodes[row.index]]} {post} />
      </div>
    {/each}
  </div>
</div>
