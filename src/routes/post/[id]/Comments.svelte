<script lang="ts">
  import Comment from './Comment.svelte'
  import type { CommentNodeI } from './comments.js'

  const maxComments = 10

  export let nodes: CommentNodeI[]
  export let isParent: boolean
</script>

<ul
  class={isParent
    ? ''
    : 'ml-2 mt-2 mx-2.5 px-2.5 border-l-2 border-black/10 dark:border-white/10'}
>
  {#each nodes.slice(0, maxComments) as node}
    <Comment {node} open={true}>
      {#if node.children?.length > 0}
        <svelte:self nodes={node.children} isParent={false} />
      {/if}
    </Comment>
  {/each}
</ul>
