<script lang="ts">
  import Comment from './Comment.svelte'
  import { buildCommentsTree, type CommentNodeI } from './comments'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  import { authData, getClient } from '$lib/lemmy.js'
  import type { CommentView, Post } from 'lemmy-js-client'
  import { fly } from 'svelte/transition'
  import { toast, ToastType } from '$lib/components/ui/toasts/toasts.js'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'

  export let nodes: CommentNodeI[]
  export let isParent: boolean
  export let post: Post

  onMount(() => {
    if (isParent && $page.url.hash) {
      document.getElementById($page.url.hash)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
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

    try {
      parent.loading = true

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
    } catch (error) {
      toast({
        content: 'Failed to fetch comments',
        type: ToastType.error,
      })
    }
  }
</script>

<ul
  in:fly={{ opacity: 0, y: -4 }}
  class={isParent
    ? ''
    : 'mt-2 pl-3.5 border-l-2 border-slate-200 dark:border-zinc-900'}
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
        <div
          class="my-2 min-w-[7rem] w-max h-8 border-l-2 border-slate-200 dark:border-zinc-900 pl-2"
        >
          <Button
            loading={node.loading}
            disabled={node.loading}
            size="sm"
            color="tertiary"
            on:click={() => {
              node.loading = true
              fetchChildren(node).then(() => (node.loading = false))
            }}
          >
            <Icon src={ChevronDown} width={16} mini slot="icon" />
            {node.comment_view.counts.child_count} more
          </Button>
        </div>
      {/if}
    </Comment>
  {/each}
</ul>
