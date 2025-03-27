<script lang="ts">
  import type { Post } from 'lemmy-js-client'
  import type { CommentNodeI } from './comments.svelte'
  import Comments from './Comments.svelte'
  import { onMount } from 'svelte'
  import VirtualList from '$lib/components/render/VirtualList.svelte'

  interface Props {
    nodes: CommentNodeI[]
    post: Post
    scrollTo: string | undefined
  }

  let { nodes, post, scrollTo }: Props = $props()

  let offsetEl = $state<HTMLElement>()

  onMount(() => {
    if (scrollTo) {
      const element = document?.getElementById(scrollTo)
      setTimeout(() => {
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  })
</script>

<div bind:this={offsetEl}>
  <VirtualList
    class="divide-y divide-slate-200 dark:divide-zinc-800 -mx-4 sm:-mx-6 w-min px-4 sm:px-6"
    overscan={500}
    items={nodes}
    initialOffset={offsetEl?.offsetTop}
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
