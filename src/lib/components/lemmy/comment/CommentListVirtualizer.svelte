<script lang="ts">
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import type { Post } from 'lemmy-js-client'
  import type { CommentNodeI } from './comments.svelte'
  import Comments from './Comments.svelte'
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

    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
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
      class="divide-y divide-slate-200 dark:divide-zinc-800 w-full"
      overscan={500}
      items={nodes}
      {initialOffset}
    >
      {#snippet item(index)}
        <div class="-mx-4 sm:-mx-6 px-4 sm:px-6">
          <Comments
            isParent={true}
            bind:nodes={() => [nodes[index]], v => (nodes[index] = v[0])}
            {post}
          />
        </div>
      {/snippet}
    </VirtualList>
  {/if}
</div>
