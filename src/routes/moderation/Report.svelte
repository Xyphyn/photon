<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import type { ReportView } from '$lib/lemmy/report.js'
  import { Badge, Button, Material, Modal, toast } from 'mono-svelte'
  import { CheckBadge, Icon } from 'svelte-hero-icons'

  interface Props {
    item: ReportView[]
  }

  let { item: items = $bindable() }: Props = $props()

  // TODO more strict type enforcing, this hack is not good
  const item = items[0]

  let resolving = $state(false)
  async function resolve() {
    if (!profile.current?.jwt || !profile.current.user) return
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
                  $notifications.reports += i.resolved ? -1 : 1
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

                  $notifications.reports += i.resolved ? -1 : 1
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

                  $notifications.reports += i.resolved ? -1 : 1
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

  let usersModal = $state(false)
  let reasonsModal = $state(false)
</script>

<Modal title="Report from" bind:open={usersModal}>
  <div class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800">
    {#each items as item}
      <UserLink avatar={false} user={item.creator} class="py-1" />
    {/each}
  </div>
</Modal>

<Modal title={$t('moderation.reason')} bind:open={reasonsModal}>
  <div class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800">
    {#each items as item}
      <div class="py-2">
        <UserLink avatar={false} user={item.creator} class="py-1 block" />
        <blockquote
          class="italic text-sm pl-4 border-l-2 border-slate-300 dark:border-zinc-700"
        >
          {item.reason}
        </blockquote>
      </div>
    {/each}
  </div>
</Modal>

<div class={['flex flex-row flex-wrap gap-4']}>
  {#if item.type == 'comment' || item.type == 'post'}
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium">{$t('form.post.community')}</span>
      <a
        href="?community={item.item.community.id}"
        class="flex items-center gap-1 font-medium hover:underline"
      >
        <Avatar
          circle={false}
          url={item.item.community.icon}
          alt={item.item.community.name}
          width={24}
        />
        {item.item.community.title}
      </a>
    </div>
  {/if}
  {#if items.length > 1}
    <button
      onclick={() => (usersModal = !usersModal)}
      class="flex-1 text-2xl font-medium hover:underline cursor-pointer text-left w-max"
    >
      {items.length}x
    </button>
  {:else}
    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium">Report from</span>
      <span class="font-bold">
        <UserLink avatar user={item.creator} />
      </span>
    </div>
  {/if}

  <div class="flex-1"></div>
  <Button
    onclick={resolve}
    class="h-max self-end"
    loading={resolving}
    disabled={resolving}
    rounding="pill"
    size="sm"
    color={item.resolved ? 'secondary' : 'primary'}
  >
    {#snippet prefix()}
      <Icon src={CheckBadge} micro size="16" />
    {/snippet}
    {!item.resolved
      ? $t('routes.moderation.resolve')
      : $t('routes.moderation.unresolve')}
  </Button>
</div>

<Material rounding="xl" color="uniform" class="dark:bg-zinc-950">
  {#if item.type == 'comment'}
    <CommentItem comment={item.item} class="p-0!" />
  {:else if item.type == 'post'}
    <Post hideCommunity post={item.item} class="p-0!" />
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
    {#if items.length > 1}
      <button
        class="cursor-pointer"
        onclick={() => (reasonsModal = !reasonsModal)}
      >
        <Badge class="w-max my-1">+{items.length - 1}</Badge>
      </button>
    {/if}
  </div>
  <div class="flex-1"></div>
  {#if item.resolver}
    <div>
      <SectionTitle small>
        {$t('routes.moderation.resolvedBy')}
      </SectionTitle>
      <UserLink avatar user={item.resolver} />
    </div>
  {/if}
</div>
