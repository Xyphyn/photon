<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { client } from '$lib/api/client.svelte'
  import type { Post } from '$lib/api/types'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { Button, toast } from 'mono-svelte'
  import { ArrowDownCircle } from 'svelte-hero-icons/dist'
  import Comment from './Comment.svelte'
  import { type CommentNodeI, buildCommentsTree } from './comments.svelte'
  import CommentTree from './CommentTree.svelte'

  interface Props {
    nodes: CommentNodeI[]
    post: Post
  }

  let { nodes = $bindable(), post }: Props = $props()

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

      const newComments = await client().getComments({
        max_depth: 5,
        parent_id: parent.comment_view.comment.id,
        type_: 'All',
      })

      if (newComments.comments.length == 0) {
        toast({
          content: $t('toast.noComments'),
          type: 'error',
        })
        return
      }

      parent.children = buildCommentsTree(
        newComments.comments,
        parent.depth,
      )[0].children
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
      contentClass={[
        (node.children.length > 0 ||
          node.comment_view.counts.child_count > 0) &&
          'border-l',
        'ml-2.5 pl-3 sm:pl-4 lg:pl-5',
        'comment-border',
      ]}
      bind:open={nodes[index].expanded}
    >
      <button
        class="expand-btn"
        onclick={() => (nodes[index].expanded = !nodes[index].expanded)}
        aria-label={$t('comment.expand')}
      ></button>
      <div class={['comment-corner', node.depth == 0 && 'hidden']}></div>
      {#if node.children?.length > 0}
        <CommentTree {post} bind:nodes={nodes[index].children} />
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
          icon={ArrowDownCircle}
        >
          {$t('comment.more', {
            comments: node.comment_view.counts.child_count,
          })}
        </Button>
      </svelte:element>
    {/if}
  {/each}
</ul>

<style>
  @reference '../../../app.css';

  :global(.comment-border) {
    border-color: var(--color-slate-200);
    @variant dark {
      border-color: var(--color-zinc-800);
    }

    transition: border-color 600ms cubic-bezier(0.075, 0.82, 0.165, 1);

    &:has(:global(> * > .expand-btn:hover:not(:active))) {
      border-color: color-mix(
        in oklab,
        var(--color-primary-900),
        var(--color-slate-500)
      );
      @variant dark {
        border-color: color-mix(
          in oklab,
          var(--color-primary-100),
          var(--color-zinc-500)
        );
      }
    }
  }

  .expand-btn {
    width: calc(var(--spacing) * 4);
    position: absolute;
    top: 0;
    left: calc(var(--spacing) * 0.5);
    height: 100%;
    cursor: pointer;
  }

  .comment-corner {
    position: absolute;
    top: calc(var(--spacing) * 2);
    left: calc(var(--spacing) * -3);
    border-bottom-left-radius: calc(infinity * 1px);
    border-left-width: 1px;
    border-bottom-width: 1px;
    border-color: var(--color-slate-200);
    @variant dark {
      border-color: var(--color-zinc-800);
    }
    width: calc(var(--spacing) * 3);
    height: calc(var(--spacing) * 3);

    @variant sm {
      top: calc(var(--spacing) * 1);
      left: calc(var(--spacing) * -5.5);
      width: calc(var(--spacing) * 5);
      height: calc(var(--spacing) * 5);
    }
  }
</style>
