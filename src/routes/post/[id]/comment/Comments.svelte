<script lang="ts">
  import Comment from './Comment.svelte'
  import type { CommentNodeI } from '../comments.js'
  import type { Post } from 'lemmy-js-client'

  const maxComments = 250

  export let nodes: CommentNodeI[]
  export let isParent: boolean
  export let post: Post
</script>

<ul
  class={isParent
    ? ''
    : 'ml-2.5 mt-2 px-2.5 border-l-2 border-black/10 dark:border-white/10'}
>
  {#each nodes.slice(0, maxComments) as node}
    <Comment postId={post.id} {node} open={true}>
      {#if node.children?.length > 0}
        <svelte:self {post} nodes={node.children} isParent={false} />
      {/if}
    </Comment>
  {/each}
</ul>
