<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { errorMessage } from '$lib/lemmy/error'
  import type { ReportView } from '$lib/lemmy/report.js'
  import { Button, Material, toast } from 'mono-svelte'
  import { CheckCircle, Icon } from 'svelte-hero-icons'

  interface Props {
    item: ReportView[]
  }

  let { item: items = $bindable() }: Props = $props()

  // TODO more strict type enforcing, this hack is not good
  const item = items[0]

  let resolving = $state(false)
  async function resolve() {
    if (!profile.data?.jwt || !profile.data.user) return
    resolving = true

    try {
      switch (item.type) {
        case 'comment': {
          await Promise.all(
            items.map(async i =>
              getClient()
                .resolveCommentReport({
                  report_id: i.id,
                  resolved: !i.resolved,
                })
                .then(res => {
                  i.resolved = res.comment_report_view.comment_report.resolved
                  i.resolver = res.comment_report_view.resolver
                  $notifications.reports += i.resolved ? 1 : -1
                }),
            ),
          )

          break
        }
        case 'post': {
          await Promise.all(
            items.map(async i =>
              getClient()
                .resolvePostReport({
                  report_id: i.id,
                  resolved: !i.resolved,
                })
                .then(res => {
                  i.resolved = res.post_report_view.post_report.resolved

                  i.resolver = res.post_report_view.resolver

                  $notifications.reports += i.resolved ? 1 : -1
                }),
            ),
          )

          break
        }
        case 'message': {
          await Promise.all(
            items.map(async i =>
              getClient()
                .resolvePrivateMessageReport({
                  report_id: i.id,
                  resolved: !i.resolved,
                })
                .then(res => {
                  i.resolved =
                    res.private_message_report_view.private_message_report.resolved

                  i.resolver = res.private_message_report_view.resolver

                  $notifications.reports += i.resolved ? 1 : -1
                }),
            ),
          )

          break
        }
      }

      toast({
        content: item.resolved
          ? $t('toast.resolveReport')
          : $t('toast.unresolveReport'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    resolving = false
  }
</script>

<div class={['flex flex-row']}>
  <div class="flex flex-col gap-1.5 flex-1">
    <span class="text-xs font-medium">Report from</span>
    <span class="font-bold">
      <UserLink avatar user={item.creator} />
    </span>
  </div>

  <Button
    onclick={resolve}
    class="h-max self-end {item.resolved
      ? 'text-green-600! dark:text-green-400!'
      : ''}"
    loading={resolving}
    disabled={resolving}
    rounding="pill"
    color="ghost"
  >
    {#snippet prefix()}
      <Icon src={CheckCircle} micro={item.resolved} size="18" />
    {/snippet}
    {!item.resolved
      ? $t('routes.moderation.resolve')
      : $t('routes.moderation.resolved')}
  </Button>
</div>

<Material rounding="xl" color="uniform" class="dark:bg-zinc-950">
  {#if item.type == 'comment'}
    <CommentItem community={true} comment={item.item} class="p-0!" />
  {:else if item.type == 'post'}
    <Post post={item.item} class="p-0!" />
  {:else if item.type == 'message'}
    <PrivateMessage
      message={{
        creator: item.reportee,
        private_message: item.item,
        recipient: item.creator,
      }}
    />
  {/if}
</Material>

<div class="flex flex-row gap-4 items-center flex-wrap">
  <div>
    <SectionTitle small>
      {$t('routes.moderation.reason')}
    </SectionTitle>
    <p>
      {item.reason}
    </p>
  </div>
  {#if item.resolver}
    <div>
      <SectionTitle small>
        {$t('routes.moderation.resolvedBy')}
      </SectionTitle>
      <UserLink avatar user={item.resolver} />
    </div>
  {/if}
</div>
