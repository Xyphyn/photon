<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import { isComment, isPost } from '$lib/lemmy/item.js'
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { profile } from '$lib/auth.js'
  import Checkbox from '$lib/components/input/Checkbox.svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { Fire, Icon, Trash } from 'svelte-hero-icons'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'

  export let open: boolean
  export let item: PostView | CommentView | undefined = undefined
  export let purge: boolean = false

  let reason = ''
  let commentReason: boolean = false
  let privateMessage: boolean = false
  let loading = false

  $: removed = item
    ? isComment(item)
      ? item.comment.removed
      : item.post.removed
    : false

  $: replyReason = `Your submission${
    privateMessage ? `in ${item?.post.name}` : ' '
  }was removed for:\n${reason}`

  async function remove() {
    if (!item) return
    if (!$profile?.jwt) throw new Error('Unauthenticated')

    loading = true

    try {
      if (purge) {
        if (isComment(item)) {
          await getClient(undefined, fetch).purgeComment({
            auth: $profile.jwt,
            comment_id: item.comment.id,
            reason: reason,
          })
        } else {
          await getClient(undefined, fetch).purgePost({
            auth: $profile.jwt,
            post_id: item.post.id,
            reason: reason,
          })
        }

        toast({
          content: 'Successfully purged that submission.',
          type: 'success',
        })

        loading = false
        open = false

        return
      }

      if (commentReason) {
        if (replyReason == '') {
          toast({
            content: 'Your reply cannot be empty if "Reply reason" is enabled.',
          })
          return
        }

        if (privateMessage) {
          await getClient()
            .createPrivateMessage({
              auth: $profile.jwt,
              content: replyReason,
              recipient_id: isComment(item)
                ? item.comment.creator_id
                : item.post.creator_id,
            })
            .catch(() => {
              toast({
                content: 'Failed to message user. Removing anyway...',
                type: 'warning',
              })
            })
        } else {
          await getClient()
            .createComment({
              auth: $profile.jwt,
              content: replyReason,
              post_id: item.post.id,
              parent_id: isComment(item) ? item.comment.id : undefined,
            })
            .catch(() => {
              toast({
                content: 'Failed to post reply. Removing anyway...',
                type: 'warning',
              })
            })
        }
      }

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
        type: 'success',
      })
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }

  const resetText = () => {
    reason = ''
    replyReason = ''
    commentReason = false
  }

  $: {
    if (item) {
      resetText()
    }
  }
</script>

<Modal bind:open>
  <span slot="title">
    {purge ? 'Purging' : removed ? 'Restoring' : 'Removing'} submission
  </span>
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

      {#if !removed && !purge}
        <Checkbox bind:checked={commentReason}>Reply with reason</Checkbox>

        {#if commentReason}
          <MultiSelect
            options={[false, true]}
            optionNames={['Comment', 'Message']}
            bind:selected={privateMessage}
          />
          <MarkdownEditor
            bind:value={replyReason}
            placeholder={replyReason}
            rows={3}
            label="Reply"
          />
        {/if}
      {/if}

      <Button
        color={purge ? 'danger' : 'primary'}
        size="lg"
        {loading}
        disabled={loading}
        submit
      >
        <Icon src={purge ? Fire : Trash} mini size="16" slot="icon" />
        {#if purge}
          Purge
        {:else}
          {removed ? 'Restore' : 'Remove'}
        {/if}
      </Button>
    </form>
  {/if}
</Modal>
