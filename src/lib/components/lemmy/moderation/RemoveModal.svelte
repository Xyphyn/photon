<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import { isComment, isPost } from '$lib/lemmy/item.js'
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'

  export let open: boolean
  export let item: PostView | CommentView | undefined = undefined

  let reason = ''
  let loading = false

  $: removed = item
    ? isComment(item)
      ? item.comment.removed
      : item.post.removed
    : false

  async function remove() {
    if (!item) return
    if (!$profile?.jwt) throw new Error('Unauthenticated')

    loading = true

    try {
      if (isComment(item)) {
        await getClient().removeComment({
          auth: $profile.jwt,
          comment_id: item.comment.id,
          removed: !removed,
          reason: reason || undefined,
        })
        item.comment.removed = !removed
      } else if (isPost(item)) {
        await getClient().removePost({
          auth: $profile.jwt,
          post_id: item.post.id,
          removed: !removed,
          reason: reason || undefined,
        })

        item.post.removed = !removed
      }

      open = false

      toast({
        content: `Successfully ${
          removed ? 'restored' : 'removed'
        } that submission.`,
        type: ToastType.success,
      })
    } catch (err) {
      toast({
        content: err as any,
        type: ToastType.error,
      })
    }

    loading = false
  }

  const resetText = () => (reason = '')

  $: {
    if (item) {
      resetText()
    }
  }
</script>

<Modal bind:open>
  <span slot="title">{removed ? 'Restoring' : 'Removing'} submission</span>
  {#if item}
    <form
      on:submit|preventDefault={remove}
      class="flex flex-col gap-4 list-none"
    >
      {#if isComment(item)}
        <Comment
          node={{
            children: [],
            comment_view: item,
            depth: 1,
          }}
          postId={item.post.id}
          actions={false}
        />
      {:else if isPost(item)}
        <Post actions={false} post={item} />
      {/if}

      <TextArea
        rows={3}
        label="Reason"
        placeholder="Optional"
        bind:value={reason}
      />

      <Button color="primary" size="lg" {loading} disabled={loading} submit>
        {removed ? 'Restore' : 'Remove'}
      </Button>
    </form>
  {/if}
</Modal>
