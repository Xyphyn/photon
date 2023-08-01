<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'

  export let open: boolean
  export let item: PostView | CommentView | undefined = undefined

  const isComment = (item: PostView | CommentView): item is CommentView =>
    'comment' in item

  const isPost = (item: PostView | CommentView): item is PostView =>
    !isComment(item)

  let loading = false
  let reason = ''

  async function report() {
    if (!item || !$profile?.jwt || reason == '') return
    loading = true

    try {
      if (isComment(item)) {
        await getClient().createCommentReport({
          auth: $profile.jwt,
          comment_id: item.comment.id,
          reason: reason,
        })
      } else if (isPost(item)) {
        await getClient().createPostReport({
          auth: $profile.jwt,
          post_id: item.post.id,
          reason: reason,
        })
      }
      open = false
      toast({
        content: 'That submission has been reported.',
        type: ToastType.success,
      })
    } catch (err) {
      toast({ content: err as any, type: ToastType.error })
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
  <h1 class="font-bold text-2xl" slot="title">Report</h1>
  <form class="flex flex-col gap-4" on:submit|preventDefault={report}>
    {#if item}
      <span>Reporting this submission</span>
      <div class="pointer-events-none list-none">
        {#if isComment(item)}
          <Comment
            actions={false}
            node={{
              children: [],
              comment_view: item,
              depth: 1,
              loading: false,
            }}
            postId={item.post.id}
          />
        {:else if isPost(item)}
          <Post actions={false} post={item} />
        {/if}
      </div>
    {/if}
    <TextArea
      required
      rows={3}
      label="Reason"
      placeholder="he's being a meanie :("
      bind:value={reason}
    />
    <Button submit {loading} disabled={loading} color="primary" size="lg">
      Submit
    </Button>
  </form>
</Modal>
