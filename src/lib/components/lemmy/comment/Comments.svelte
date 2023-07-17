<script lang="ts">
  import Comment from './Comment.svelte'
  import { buildCommentsTree, type CommentNodeI } from './comments'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  import { authData, getClient } from '$lib/lemmy.js'
  import type { Post } from 'lemmy-js-client'
  import { Color } from '$lib/ui/colors.js'
  import { fly } from 'svelte/transition'

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
      max_depth: 5,
      parent_id: parent.comment_view.comment.id,
    })

    if (newComments.comments.length == 0) {
      loadingChildren = false
      return
    }

    // this code sucks, but for some reason it works
    // lemmy api is quite goofy
    parent.children = buildCommentsTree(newComments.comments, true).find(
      (c) => c.comment_view.comment.id == parent.comment_view.comment.id
    )!.children

    loadingChildren = false
  }
</script>

<ul
  in:fly={{ opacity: 0, y: -4 }}
  class={isParent
    ? ''
    : 'ml-2.5 mt-2 pl-2.5 border-l-2 border-black/10 dark:border-white/10'}
>
  {#each nodes as node (node.comment_view.comment.id)}
    <Comment
      postId={post.id}
      {node}
      open={true}
      op={post.creator_id == node.comment_view.creator.id}
    >
      {#if node.children?.length > 0}
        <svelte:self {post} nodes={node.children} isParent={false} />
      {/if}
      {#if node.comment_view.counts.child_count > 0 && node.children.length == 0}
        <div class="my-2 w-36 h-8">
          <Button
            loading={loadingChildren}
            disabled={loadingChildren}
            large
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
