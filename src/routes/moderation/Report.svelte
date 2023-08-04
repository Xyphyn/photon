<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { getClient } from '$lib/lemmy.js'
  import { isCommentReport, isPostReport } from '$lib/lemmy/item.js'
  import type {
    CommentReportView,
    PostReportView,
    PrivateMessageReportView,
  } from 'lemmy-js-client'
  import { Check, Icon } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'

  export let item: PostReportView | CommentReportView | PrivateMessageReportView

  $: resolved = isCommentReport(item)
    ? item.comment_report.resolved
    : isPostReport(item)
    ? item.post_report.resolved
    : false

  let resolving = false
  async function resolve() {
    if (!$profile?.jwt || !$profile.user) return
    resolving = true

    try {
      if (isCommentReport(item)) {
        await getClient().resolveCommentReport({
          auth: $profile.jwt,
          report_id: item.comment_report.id,
          resolved: !resolved,
        })

        resolved = !resolved

        toast({
          content: `${resolved ? 'Resolved' : 'Unresolved'} that report.`,
          type: 'success',
        })
      } else if (isPostReport(item)) {
        await getClient().resolvePostReport({
          auth: $profile.jwt,
          report_id: item.post_report.id,
          resolved: !resolved,
        })

        resolved = !resolved
        toast({
          content: `${resolved ? 'Resolved' : 'Unresolved'} that report.`,
          type: 'success',
        })
      }

      const reports = await getClient().getReportCount({
        auth: $profile?.jwt,
      })

      $profile.user.reports =
        reports.comment_reports +
        reports.post_reports +
        (reports.private_message_reports ?? 0)
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    resolving = false
  }
</script>

{#if isCommentReport(item)}
  <CommentItem
    comment={{
      ...item,
      subscribed: 'NotSubscribed',
      creator_blocked: false,
      saved: false,
      creator: item.comment_creator,
    }}
  />
  <div class="flex flex-row gap-4 items-center">
    <div>
      <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
        Reason
      </span>
      <p>
        {item.comment_report.reason}
      </p>
    </div>
    <Button
      on:click={resolve}
      class="w-8 h-8 !p-1 ml-auto {resolved ? '!text-green-500' : ''}"
      aria-label="Resolve"
      title="Resolve"
      loading={resolving}
      disabled={resolving}
    >
      <Icon src={Check} mini size="16" slot="icon" />
    </Button>
  </div>
{:else if isPostReport(item)}
  <Post
    post={{
      ...item,
      saved: false,
      subscribed: 'NotSubscribed',
      unread_comments: 0,
      read: false,
      creator_blocked: false,
      creator: item.post_creator,
    }}
  />
  <div class="flex flex-row gap-4 items-center">
    <div>
      <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
        Reason
      </span>
      <p>
        {item.post_report.reason}
      </p>
    </div>
    <Button
      on:click={resolve}
      class="w-8 h-8 !p-1 ml-auto {resolved ? '!text-green-500' : ''}"
      aria-label="Resolve"
      title="Resolve"
      loading={resolving}
      disabled={resolving}
    >
      <Icon src={Check} mini size="16" slot="icon" />
    </Button>
  </div>
{/if}
