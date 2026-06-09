<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { ReportCombinedView } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { CommentModel } from '$lib/feature/comment/comment.svelte'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte'
  import PrivateMessage from '$lib/feature/inbox/PrivateMessage.svelte'
  import { PostItem } from '$lib/feature/post'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { Button, Label, Material, toast } from 'mono-svelte'
  import { CheckBadge } from 'svelte-hero-icons/dist'

  interface Props {
    item: ReportCombinedView
  }

  let { item }: Props = $props()

  let resolved = $derived.by(() => {
    switch (item.type_) {
      case 'comment':
        return item.comment_report.resolved
      case 'post':
        return item.post_report.resolved
      case 'private_message':
        return item.private_message_report.resolved
      case 'community':
        return item.community_report.resolved
    }
  })
  let loading = $state(false)

  async function resolve() {
    loading = true

    try {
      switch (item.type_) {
        case 'comment': {
          await client()
            .resolveCommentReport({
              report_id: item.comment_report.id,
              resolved: !resolved,
            })
            .then((res) => {
              item.resolver = res.comment_report_view.resolver
              profile.inbox.notifications.reports += item.resolver != null ? -1 : 1
            })

          break
        }
        case 'post': {
          await client()
            .resolvePostReport({
              report_id: item.post_report.id,
              resolved: !resolved,
            })
            .then((res) => {
              item.resolver = res.post_report_view.resolver
              profile.inbox.notifications.reports += item.resolver != null ? -1 : 1
            })

          break
        }
        case 'private_message': {
          await client()
            .resolvePrivateMessageReport({
              report_id: item.private_message_report.id,
              resolved: !resolved,
            })
            .then((res) => {
              item.resolver = res.private_message_report_view.resolver
              profile.inbox.notifications.reports += item.resolver != null ? -1 : 1
            })

          break
        }
      }

      resolved = !resolved
      toast({
        content: !resolved ? $t('toast.resolveReport') : $t('toast.unresolveReport'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    loading = false
  }
</script>

<div class={['flex flex-row flex-wrap gap-4']}>
  {#if item.type_ == 'comment' || item.type_ == 'post'}
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium">{$t('form.post.community')}</span>
      <a
        href="?community={item.community.id}"
        class="flex items-center gap-1 font-medium hover:underline"
      >
        <Avatar circle={false} url={item.community.icon} alt={item.community.name} width={24} />
        {item.community.title}
      </a>
    </div>
  {/if}

  <div class="flex-1"></div>
  <Button
    onclick={resolve}
    class="h-max self-end"
    {loading}
    disabled={loading}
    color={resolved ? 'secondary' : 'primary'}
    icon={CheckBadge}
  >
    {!resolved ? $t('routes.moderation.resolve') : $t('routes.moderation.unresolve')}
  </Button>
</div>

<Material rounding="xl" color="uniform" class="dark:bg-zinc-950 mx-2">
  {#if item.type_ == 'comment'}
    <CommentItem comment={new CommentModel({ ...item, can_mod: true })} class="p-0!" />
  {:else if item.type_ == 'post'}
    <PostItem post={repos.posts.get({ ...item, can_mod: true })} />
  {:else if item.type_ == 'private_message'}
    <PrivateMessage
      message={{
        creator: item.creator,
        private_message: item.private_message,
        recipient: item.creator,
      }}
    />
  {/if}
</Material>

<div class="flex flex-row gap-4 items-center flex-wrap">
  <div>
    <Label>
      {$t('routes.moderation.reason')}
    </Label>
    <p>
      {#if item.type_ == 'post'}
        {item.post_report.reason}
      {:else if item.type_ == 'comment'}
        {item.comment_report.reason}
      {:else if item.type_ == 'private_message'}
        {item.private_message_report.reason}
      {:else if item.type_ == 'community'}
        {item.community_report.reason}
      {/if}
    </p>
  </div>
  <div class="flex-1"></div>
  {#if item.resolver}
    <div>
      <Label>
        {$t('routes.moderation.resolvedBy')}
      </Label>
      <UserLink avatar user={item.resolver} />
    </div>
  {/if}
</div>
