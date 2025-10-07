<script lang="ts">
  import type { Post } from '$lib/api/types'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import { onMount } from 'svelte'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import type { CommentNodeI } from './comments.svelte'
  import CommentTree from './CommentTree.svelte'

  interface Props {
    nodes: CommentNodeI[]
    post: Post
    scrollTo?: string
  }

  onMount(() => {
    if (scrollTo) {
      const element = document?.getElementById(scrollTo)
      setTimeout(() => {
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (offsetEl) {
          initialOffset =
            entry.target.getBoundingClientRect().top + window.scrollY
        }
      })
    })

    if (offsetEl) observer.observe(offsetEl)
    return () => observer.disconnect()
  })

  let { nodes, post, scrollTo }: Props = $props()

  let offsetEl = $state<HTMLElement>()
  let initialOffset = $derived(offsetEl?.offsetTop)
</script>

<div bind:this={offsetEl}>
  {#if offsetEl}
    <VirtualList
      class="divide-y-2 divide-slate-100 dark:divide-zinc-900 -mx-3 sm:-mx-6"
      overscan={5}
      estimatedHeight={500}
      items={nodes}
      {initialOffset}
    >
      {#snippet item(row)}
        <div
          in:fly={row < 7
            ? { duration: 800, easing: expoOut, y: 12, delay: row * 50 }
            : { opacity: 1, duration: 0 }}
          class="px-3 sm:px-6"
        >
          <CommentTree
            bind:nodes={() => [nodes[row]], (v) => (nodes[row] = v[0])}
            {post}
          />
        </div>
      {/snippet}
    </VirtualList>
  {/if}
</div>
