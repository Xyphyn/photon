<script lang="ts">
  import { getClient } from '$lib/api/client.svelte'
  import type { CommentView, PostView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { fullCommunityName } from '$lib/app/util.svelte'
  import MultiSelect from '$lib/ui/form/Switch.svelte'
  import { Button, Modal, Option, Select, Switch, toast } from 'mono-svelte'
  import { Fire, Trash } from 'svelte-hero-icons/dist'
  import { preventDefault, run } from 'svelte/legacy'
  import Comment from '../comment/Comment.svelte'
  import { isCommentView, isPostView } from '../legacy/item'
  import { Post } from '../post'
  import { removalTemplate } from './moderation'

  interface Props {
    open: boolean
    item?: PostView | CommentView | undefined
    purge?: boolean
  }

  let {
    open = $bindable(),
    item = $bindable(undefined),
    purge = false,
  }: Props = $props()

  let reason = $state('')
  let commentReason: boolean = $state(
    settings.moderation.defaultRemoveAction != null,
  )
  let privateMessage: boolean = $state(
    settings.moderation.defaultRemoveAction == 'message',
  )
  let loading = $state(false)
  let preset = $state(settings.moderation.presets[0]?.content ?? '')

  $effect(() => {
    if (!commentReason) settings.moderation.defaultRemoveAction = null
    else if (privateMessage) settings.moderation.defaultRemoveAction = 'message'
    else settings.moderation.defaultRemoveAction = 'comment'
  })

  let removed = $derived(
    item
      ? isCommentView(item)
        ? item.comment.removed
        : item.post.removed
      : false,
  )

  const getReplyReason = (reason: string, preset: string) => {
    if (!item) return `no template`

    return removalTemplate(preset, {
      communityLink: `!${fullCommunityName(
        item!.community.name,
        item!.community.actor_id,
      )}`,
      postTitle: item.post.name,
      reason: reason,
      username: item.creator.name,
    })
  }

  let replyReason = $state('')
  $effect(() => {
    replyReason = commentReason ? getReplyReason(reason, preset) : ''
  })

  async function remove() {
    if (!item) return
    if (!profile.current?.jwt) throw new Error('Unauthenticated')

    loading = true

    try {
      if (purge) {
        if (isCommentView(item)) {
          await getClient(undefined, fetch).purgeComment({
            comment_id: item.comment.id,
            reason: reason,
          })
        } else {
          await getClient(undefined, fetch).purgePost({
            post_id: item.post.id,
            reason: reason,
          })
        }

        toast({
          content: $t('moderation.removeSubmission.successPurge'),
          type: 'success',
        })

        loading = false
        open = false

        return
      }

      if (commentReason) {
        if (replyReason == '') {
          toast({
            content: $t('moderation.removeSubmission.failEmptyReply'),
          })
          return
        }

        if (privateMessage) {
          await getClient()
            .createPrivateMessage({
              content: replyReason,
              recipient_id: isCommentView(item)
                ? item.comment.creator_id
                : item.post.creator_id,
            })
            .catch(() => {
              toast({
                content: $t('moderation.removeSubmission.failMessage'),
                type: 'warning',
              })
            })
        } else {
          await getClient()
            .createComment({
              content: replyReason,
              post_id: item.post.id,
              parent_id: isCommentView(item) ? item.comment.id : undefined,
            })
            .catch(() => {
              toast({
                content: $t('moderation.removeSubmission.failReply'),
                type: 'warning',
              })
            })
        }
      }

      if (isCommentView(item)) {
        await getClient().removeComment({
          comment_id: item.comment.id,
          removed: !removed,
          reason: reason || undefined,
        })
        item.comment.removed = !removed
      } else if (isPostView(item)) {
        await getClient().removePost({
          post_id: item.post.id,
          removed: !removed,
          reason: reason || undefined,
        })

        item.post.removed = !removed
      }

      open = false
    } catch (err) {
      toast({
        content: errorMessage(err),
        type: 'error',
      })
    }

    loading = false
  }

  const resetText = () => {
    reason = ''
  }

  run(() => {
    if (item) {
      resetText()
    }
  })
</script>

<Modal
  bind:open
  title={purge
    ? $t('moderation.removeSubmission.titlePurge')
    : removed
      ? $t('moderation.removeSubmission.titleRestore')
      : $t('moderation.removeSubmission.title')}
>
  {#if item}
    <form
      onsubmit={preventDefault(remove)}
      class="flex flex-col gap-4 list-none"
    >
      {#if isCommentView(item)}
        <Comment
          node={{
            children: [],
            comment_view: item,
            depth: 1,
          }}
          postId={item.post.id}
          actions={false}
        />
      {:else if isPostView(item)}
        <Post actions={false} post={item} />
      {/if}

      <MarkdownEditor
        rows={3}
        label="Reason"
        placeholder="Optional"
        bind:value={reason}
      />

      {#if !removed}
        <Switch bind:checked={commentReason}>
          {$t('moderation.removeSubmission.withReason')}
        </Switch>

        {#if commentReason}
          <MultiSelect
            options={[false, true]}
            optionNames={[
              $t('moderation.removeSubmission.comment'),
              $t('moderation.removeSubmission.message'),
            ]}
            bind:selected={privateMessage}
          />
          <MarkdownEditor
            bind:value={replyReason}
            placeholder={replyReason}
            rows={3}
          >
            {#snippet customLabel()}
              <div class="flex justify-between items-end mb-1">
                {$t('comment.reply')}
                <Select bind:value={preset} placeholder="No preset">
                  {#each settings.moderation.presets as preset}
                    <Option value={preset.content}>
                      {preset.title}
                    </Option>
                  {/each}
                </Select>
              </div>
            {/snippet}
          </MarkdownEditor>
        {/if}
      {/if}

      <Button
        color={purge ? 'danger' : 'primary'}
        size="lg"
        {loading}
        disabled={loading}
        submit
        icon={purge ? Fire : Trash}
      >
        {#if purge}
          {$t('admin.purge')}
        {:else}
          {removed ? $t('moderation.restore') : $t('moderation.remove')}
        {/if}
      </Button>
    </form>
  {/if}
</Modal>
