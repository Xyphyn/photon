<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { PrivateMessageView } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import ButtonGroup from 'mono-svelte/button/ButtonGroup.svelte'
  import { Plus } from 'svelte-hero-icons/dist'
  import { preventDefault, run } from 'svelte/legacy'
  import { CommentModel } from '../comment/comment.svelte'
  import CommentItem from '../comment/CommentItem.svelte'
  import PrivateMessage from '../inbox/PrivateMessage.svelte'
  import { PostModel } from '../post/post.svelte'
  import PostItem from '../post/PostItem.svelte'

  interface Props {
    open: boolean
    item?: PostModel | CommentModel | PrivateMessageView | undefined
  }

  let { open = $bindable(), item = $bindable() }: Props = $props()

  let loading = $state(false)
  let reason = $state('')

  async function report() {
    if (!item || !profile.current?.jwt || reason == '') return
    loading = true

    try {
      if (item instanceof CommentModel) {
        await client().createCommentReport({
          comment_id: item.comment.id,
          reason: reason,
        })
      } else if (item instanceof PostModel) {
        await client().createPostReport({
          post_id: item.post.id,
          reason: reason,
        })
      } else {
        await client().createPrivateMessageReport({
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
        {#if item instanceof CommentModel}
          <CommentItem actions={false} comment={item} />
        {:else if item instanceof PostModel}
          <PostItem post={item} />
        {:else}
          <PrivateMessage message={item} />
        {/if}
      </div>
    {/if}
    <MarkdownEditor required rows={4} label={$t('moderation.reason')} bind:value={reason} />
    <ButtonGroup orientation="horizontal" class="flex flex-wrap">
      <Button
        onclick={() => (reason = $t('moderation.reportModal.presets.spam'))}
        disabled={reason == $t('moderation.reportModal.presets.spam')}
        icon={Plus}
      >
        {$t('moderation.reportModal.presets.spam')}
      </Button>
      <Button
        onclick={() => (reason = $t('moderation.reportModal.presets.rules.content'))}
        disabled={reason.startsWith(
          $t('moderation.reportModal.presets.rules.content').slice(0, -3),
        )}
        icon={Plus}
      >
        {$t('moderation.reportModal.presets.rules')}
      </Button>
    </ButtonGroup>
    <Button submit {loading} disabled={loading} color="primary" size="lg">
      {$t('form.submit')}
    </Button>
  </form>
</Modal>
