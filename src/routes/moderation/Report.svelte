<script lang="ts">
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import { toast } from 'mono-svelte'
  import { getClient } from '$lib/lemmy.js'
  import { isCommentReport, isPostReport } from '$lib/lemmy/item.js'
  import type {
    CommentReportView,
    PostReportView,
    PrivateMessageReportView,
  } from 'lemmy-js-client'
  import { Check, Icon } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { Button } from 'mono-svelte'
  import type { ReportView } from '$lib/lemmy/report.js'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import { t } from '$lib/translations'

  export let item: ReportView

  let resolving = false
  async function resolve() {
    if (!$profile?.jwt || !$profile.user) return
    resolving = true

    try {
      switch (item.type) {
        case 'comment': {
          const res = await getClient().resolveCommentReport({
            report_id: item.id,
            resolved: !item.resolved,
          })

          item.resolved = res.comment_report_view.comment_report.resolved

          toast({
            content: `${
              item.resolved ? 'Resolved' : 'Unresolved'
            } that report.`,
            type: 'success',
          })

          break
        }
        case 'post': {
          const res = await getClient().resolvePostReport({
            report_id: item.id,
            resolved: !item.resolved,
          })

          item.resolved = res.post_report_view.post_report.resolved
          toast({
            content: `${
              item.resolved ? 'Resolved' : 'Unresolved'
            } that report.`,
            type: 'success',
          })

          break
        }
        case 'message': {
          const res = await getClient().resolvePrivateMessageReport({
            report_id: item.id,
            resolved: !item.resolved,
          })

          item.resolved =
            res.private_message_report_view.private_message_report.resolved
          toast({
            content: `${
              item.resolved ? 'Resolved' : 'Unresolved'
            } that report.`,
            type: 'success',
          })

          break
        }
      }

      $profile.user.notifications.reports += item.resolved ? 1 : -1
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    resolving = false
  }
</script>

{#if item.type == 'comment'}
  <CommentItem community={true} comment={item.item} />
{:else if item.type == 'post'}
  <Post post={item.item} />
{:else if item.type == 'message'}
  <PrivateMessage
    message={{
      creator: item.reportee,
      private_message: item.item,
      recipient: item.creator,
    }}
  />
{/if}

<div class="flex flex-row gap-4 items-center">
  <div>
    <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
      {$t('routes.moderation.reason')}
    </span>
    <p>
      {item.reason}
    </p>
  </div>
  <Button
    on:click={resolve}
    class="w-8 h-8 !p-1 ml-auto {item.resolved
      ? '!text-green-600 dark:!text-green-400'
      : ''}"
    title={$t('routes.moderation.resolve')}
    loading={resolving}
    disabled={resolving}
  >
    <Icon src={Check} mini size="16" slot="prefix" />
  </Button>
</div>
