<script lang="ts">
  import { preventDefault, run } from 'svelte/legacy'

  import { profile } from '$lib/app/auth.svelte.js'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { t } from '$lib/app/i18n'
  import { getClient } from '$lib/api/client.svelte'
  import type {
    CommentView,
    PostView,
    PrivateMessageView,
  } from '$lib/api/types'
  import { Button, Modal, toast } from 'mono-svelte'
  import PrivateMessage from '../inbox/PrivateMessage.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { Post } from '../post'
  import Comment from '../comment/Comment.svelte'

  interface Props {
    open: boolean
    item?: PostView | CommentView | PrivateMessageView | undefined
  }

  let { open = $bindable(), item = $bindable() }: Props = $props()

  const isComment = (
    item: PostView | CommentView | PrivateMessageView,
  ): item is CommentView => 'comment' in item

  const isPost = (
    item: PostView | CommentView | PrivateMessageView,
  ): item is PostView => !isComment(item) && 'post' in item

  const isPrivateMessage = (
    item: PostView | CommentView | PrivateMessageView,
  ): item is PrivateMessageView => !isComment(item) && 'private_message' in item

  let loading = $state(false)
  let reason = $state('')

  async function report() {
    if (!item || !profile.current?.jwt || reason == '') return
    loading = true

    try {
      if (isComment(item)) {
        await getClient().createCommentReport({
          comment_id: item.comment.id,
          reason: reason,
        })
      } else if (isPost(item)) {
        await getClient().createPostReport({
          post_id: item.post.id,
          reason: reason,
        })
      } else if (isPrivateMessage(item)) {
        await getClient().createPrivateMessageReport({
          private_message_id: item.private_message.id,
          reason: reason,
        })
      }
      open = false
      toast({
        content: $t('moderation.reportModal.success'),
        type: 'success',
      })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }

    loading = false
  }

  const resetText = () => (reason = '')

  run(() => {
    if (item) {
      resetText()
    }
  })
</script>

<Modal bind:open title={$t('moderation.reportModal.title')}>
  <form class="flex flex-col gap-4" onsubmit={preventDefault(report)}>
    {#if item}
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
        {:else}
          <PrivateMessage message={item} />
        {/if}
      </div>
    {/if}
    <MarkdownEditor
      required
      rows={4}
      label={$t('moderation.reason')}
      bind:value={reason}
    />
    <Button submit {loading} disabled={loading} color="primary" size="lg">
      {$t('form.submit')}
    </Button>
  </form>
</Modal>
