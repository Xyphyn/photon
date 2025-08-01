<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { errorMessage } from '$lib/lemmy/error'
  import type { Post } from 'lemmy-js-client'
  import { Button, toast } from 'mono-svelte'
  import { ArrowDownCircle, Icon } from 'svelte-hero-icons'
  import Comment from './Comment.svelte'
  import Comments from './CommentTree.svelte'
  import { buildCommentsTree, type CommentNodeI } from './comments.svelte'

  interface Props {
    nodes: CommentNodeI[]
    post: Post
  }

  let { nodes = $bindable(), post }: Props = $props()

  let childrenPage = 0

  async function fetchChildren(parent: CommentNodeI) {
    if (
      !(
        parent.comment_view.counts.child_count > 0 &&
        parent.children.length == 0
      )
    ) {
      return
    }

    try {
      parent.loading = true

      const newComments = await getClient(page.params.instance).getComments({
        max_depth: 5,
        parent_id: parent.comment_view.comment.id,
        type_: 'All',
        page: childrenPage,
      })

      if (newComments.comments.length == 0) {
        toast({
          content: $t('toast.noComments'),
          type: 'error',
        })
        return
      }

      const tree = buildCommentsTree(newComments.comments, parent.depth)

      // 0.18.2 -> 0.18.3 broke this
      // so i'm adding this check
      const treeParent = tree.find(
        c => c.comment_view.comment.id == parent.comment_view.comment.id,
      )

      if (treeParent) {
        // < 0.18.3
        parent.children = treeParent.children
        if (treeParent.children.length == 0) {
          toast({
            content: $t('toast.noComments'),
            type: 'warning',
          })
        }
      } else {
        // 0.18.3+
        parent.children = tree
        if (tree.length == 0) {
          toast({
            content: $t('toast.noComments'),
            type: 'warning',
          })
        }
      }
      childrenPage++
    } catch (err) {
      console.error(err)
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
  }
</script>

<ul>
  {#each nodes as node, index (node.comment_view.comment.id)}
    <Comment
      bind:node={nodes[index]}
      postId={post.id}
      op={post.creator_id == node.comment_view.creator.id}
      contentClass={[
        (node.children.length > 0 ||
          node.comment_view.counts.child_count > 0) &&
          'border-l',
        'ml-2.5 pl-3 sm:pl-4 lg:pl-5',
        node.depth % 2 == 0
          ? 'border-slate-200 dark:border-zinc-800'
          : 'border-slate-300/80 dark:border-zinc-700',
      ]}
      bind:open={nodes[index].expanded}
    >
      {#if node.children?.length > 0}
        <Comments {post} bind:nodes={nodes[index].children} />
      {/if}
    </Comment>
    {#if node.comment_view.counts.child_count > 0 && node.children.length == 0}
      <svelte:element
        this={browser ? 'div' : 'a'}
        class="w-full h-10 -mt-2 -ml-2.5"
        href="/comment/{node.comment_view.comment.id}"
      >
        <Button
          loading={nodes[index].loading}
          disabled={nodes[index].loading}
          rounding="pill"
          color="tertiary"
          class="font-normal text-slate-600 dark:text-zinc-400"
          shadow="none"
          loaderWidth={16}
          onclick={() => {
            if (nodes[index].depth > 4) {
              goto(`/comment/${nodes[index].comment_view.comment.id}#comments`)
            } else {
              nodes[index].loading = true
              fetchChildren(nodes[index]).then(
                () => (nodes[index].loading = false),
              )
            }
          }}
        >
          {#snippet prefix()}
            <Icon
              src={ArrowDownCircle}
              micro
              size="16"
              class="text-primary-900 dark:text-primary-100"
            />
          {/snippet}
          {$t('comment.more', {
            comments: node.comment_view.counts.child_count,
          })}
        </Button>
      </svelte:element>
    {/if}
  {/each}
</ul>
