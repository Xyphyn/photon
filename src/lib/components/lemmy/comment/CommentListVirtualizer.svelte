<script lang="ts">
  import type { Post } from 'lemmy-js-client'
  import type { CommentNodeI } from './comments.svelte'
  import Comments from './Comments.svelte'
  import { onMount, tick } from 'svelte'
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import { page } from '$app/state'

  interface Props {
    nodes: CommentNodeI[]
    post: Post
    scrollTo: string | undefined
  }

  let { nodes, post, scrollTo }: Props = $props()

  let offsetEl = $state<HTMLElement>()
  let list = $state()

  let initialOffset = $state(0)

  const updateOffset = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting && offsetEl) {
      initialOffset = entry.boundingClientRect.top + window.scrollY
    }
  }

  onMount(() => {
    if (scrollTo) {
      const element = document?.getElementById(scrollTo)
      setTimeout(() => {
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }

    // IntersectionObserver to watch for shifts
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(updateOffset)
      },
      { threshold: [0, 1] },
    )

    if (offsetEl) {
      observer.observe(offsetEl)
    }

    return () => {
      observer.disconnect()
    }
  })
</script>

<div bind:this={offsetEl}>
  <VirtualList
    class="divide-y divide-slate-200 dark:divide-zinc-800 w-full"
    overscan={500}
    items={nodes}
    {initialOffset}
    bind:this={list}
  >
    {#snippet item(item, index)}
      <div class="-mx-4 sm:-mx-6 px-4 sm:px-6">
        <Comments
          isParent={true}
          bind:nodes={() => [nodes[index]], (v) => (nodes[index] = v[0])}
          {post}
        />
      </div>
    {/snippet}
  </VirtualList>
</div>
