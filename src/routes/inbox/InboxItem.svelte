<script lang="ts">
  import { notifications, profile } from '$lib/auth.svelte.js'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import PrivateMessageModal from '$lib/components/lemmy/modal/PrivateMessageModal.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/client/lemmy.svelte'
  import type { InboxItem } from '$lib/lemmy/inbox.js'
  import { escapeHtml } from '$lib/util.svelte'
  import { Button } from 'mono-svelte'
  import { Eye, EyeSlash, Icon } from 'svelte-hero-icons'

  interface Props {
    item: InboxItem
  }

  let { item = $bindable() }: Props = $props()

  let replying = $state(false)
  let loading = $state(false)

  async function markAsRead(isRead: boolean) {
    if (!profile.current?.jwt) return

    loading = true

    switch (item.type) {
      case 'person_mention': {
        await getClient().markPersonMentionAsRead({
          person_mention_id: item.id,
          read: isRead,
        })
        break
      }
      case 'comment_reply': {
        await getClient().markCommentReplyAsRead({
          comment_reply_id: item.id,
          read: isRead,
        })
        break
      }
      case 'private_message': {
        await getClient().markPrivateMessageAsRead({
          private_message_id: item.id,
          read: isRead,
        })
      }
    }

    item.read = isRead
    if (profile.current.user) $notifications.inbox += isRead ? -1 : 1

    loading = false
  }
</script>

{#if replying && item.type == 'private_message'}
  <PrivateMessageModal bind:open={replying} user={item.item.creator} />
{/if}

<Expandable open icon={false}>
  {#snippet title()}
    <div class="flex flex-row gap-2 items-center w-full">
      <Avatar url={item.creator.avatar} width={28} alt={item.creator.name} />
      <div class="flex flex-col">
        <div class="text-sm font-normal text-slate-600 dark:text-zinc-400">
          {#if item.type == 'comment_reply'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.reply', {
              user: `<strong>${item.creator.name}</strong>`,
              post: `<strong>${escapeHtml(item.item.post.name)}</strong>`,
            })}
          {:else if item.type == 'person_mention'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.mention', {
              user: `<strong>${item.creator.name}</strong>`,
              post: `<strong>${escapeHtml(item.item.post.name)}</strong>`,
            })}
          {:else if item.type == 'private_message'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.message', {
              user: `<strong>${item.item.creator.name}</strong>`,
              recipient: `<strong>${item.item.recipient.name}</strong>`,
            })}
          {/if}
        </div>
        <div class="text-xs text-slate-600 dark:text-zinc-400">
          <RelativeDate date={publishedToDate(item.published)} />
        </div>
      </div>
      <div class="flex-1"></div>
      <div class="flex gap-2 max-md:hidden shrink-0">
        <Button
          color={item.read ? 'secondary' : 'primary'}
          {loading}
          disabled={loading}
          onclick={(e) => {
            e.stopPropagation()
            markAsRead(!item.read)
          }}
          size="sm"
          rounding="pill"
          class="shrink-0"
        >
          {#snippet prefix()}
            <Icon src={item.read ? EyeSlash : Eye} size="16" micro />
          {/snippet}
          {item.read
            ? $t('post.actions.more.markUnread')
            : $t('post.actions.more.markRead')}
        </Button>
        <Button
          href={item.type == 'private_message'
            ? `/inbox/messages/${item.item.private_message.creator_id}`
            : `/comment/${item.item.comment.id}`}
          size="sm"
          rounding="pill"
          class="shrink-0"
        >
          {$t('common.jump')}
        </Button>
      </div>
    </div>
  {/snippet}
  {#snippet extended()}
    <div class="flex gap-2 w-full md:hidden mt-1 flex-wrap">
      <Button
        color={item.read ? 'secondary' : 'primary'}
        {loading}
        disabled={loading}
        onclick={(e) => {
          e.stopPropagation()
          markAsRead(!item.read)
        }}
        size="sm"
        rounding="pill"
      >
        {#snippet prefix()}
          <Icon src={item.read ? EyeSlash : Eye} size="16" micro />
        {/snippet}
        {item.read
          ? $t('post.actions.more.markUnread')
          : $t('post.actions.more.markRead')}
      </Button>
      <Button
        href={item.type == 'private_message'
          ? `/inbox/messages/${item.item.private_message.creator_id}`
          : `/comment/${item.item.comment.id}`}
        size="sm"
        rounding="pill"
      >
        {$t('common.jump')}
      </Button>
    </div>
  {/snippet}
  {#snippet content()}
    {#if item.type == 'comment_reply' || item.type == 'person_mention'}
      <CommentItem
        comment={item.item}
        community={false}
        meta={false}
        class="py-0!"
        commentClass="py-0!"
      />
    {:else}
      <PrivateMessage message={item.item} meta={false} />
    {/if}
  {/snippet}
</Expandable>

<style>
  :global(strong) {
    font-weight: 600;
    color: var(--color-primary-900);
  }

  :global(.dark strong) {
    color: var(--color-primary-100);
  }
</style>
