<script lang="ts">
  import VirtualList from '$comp/render/VirtualList.svelte'
  import type { Post } from '$lib/client/types'
  import type { CommentNodeI } from './comments.svelte'
  import Comments from './CommentTree.svelte'
  import { onMount } from 'svelte'

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
      {#snippet item(index)}
        <div class={['px-3 sm:px-6', index % 2 == 1 && '']}>
          <Comments
            bind:nodes={() => [nodes[index]], (v) => (nodes[index] = v[0])}
            {post}
          />
        </div>
      {/snippet}
    </VirtualList>
  {/if}
</div>
