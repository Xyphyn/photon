<script lang="ts">
  import Comment from './Comment.svelte'
  import { buildCommentsTree, type CommentNodeI } from './comments'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  import { authData, getClient } from '$lib/lemmy.js'

  const maxComments = 250

  export let nodes: CommentNodeI[]
  export let isParent: boolean
  export let post: Post

  onMount(() => {
    if (isParent && $page.url.hash) {
      document.getElementById($page.url.hash)?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  })

  let loadingChildren = false

  async function fetchChildren(parent: CommentNodeI) {
    if (
      !(
        parent.comment_view.counts.child_count > 0 &&
        parent.children.length == 0
      )
    )
      return

    loadingChildren = true

    const newComments = await getClient().getComments({
      auth: $authData?.token,
      max_depth: 3,
      parent_id: parent.comment_view.comment.id,
    })

    parent.children = buildCommentsTree(
      newComments.comments.filter(
        (comment) => comment.comment.id != parent.comment_view.comment.id
      ),
      true
    ).map((node) => ({
      children: node.children,
      comment_view: node.comment_view,
      depth: node.depth + parent.depth,
    }))

    loadingChildren = false
  }
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
      {#if node.comment_view.counts.child_count > 0 && node.children.length == 0}
        <div class="m-1">
          <Button
            loading={loadingChildren}
            disabled={loadingChildren}
            on:click={() => fetchChildren(node)}
          >
            <Icon src={ChevronDown} width={16} mini />
            Load {node.comment_view.counts.child_count} more
          </Button>
        </div>
      {/if}
    </Comment>
  {/each}
</ul>
