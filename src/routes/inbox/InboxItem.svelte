<script lang="ts">
  import CommentItem from '$comp/lemmy/comment/CommentItem.svelte'
  import PrivateMessage from '$comp/lemmy/inbox/PrivateMessage.svelte'
  import Markdown from '$comp/markdown/Markdown.svelte'
  import Avatar from '$comp/ui/Avatar.svelte'
  import Expandable from '$comp/ui/Expandable.svelte'
  import RelativeDate from '$comp/util/RelativeDate.svelte'
  import { publishedToDate } from '$comp/util/date.js'
  import { notifications, profile } from '$lib/auth.svelte.js'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { t } from '$lib/i18n/translations'
  import type { InboxItem } from '$lib/lemmy/inbox.js'
  import { escapeHtml } from '$lib/util.svelte'
  import { Button } from 'mono-svelte'
  import { Eye, EyeSlash } from 'svelte-hero-icons'

  interface Props {
    item: InboxItem
  }

  let { item = $bindable() }: Props = $props()

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

<Expandable open icon={false}>
  {#snippet title()}
    <div class="flex flex-row gap-2 items-center w-full">
      <Avatar url={item.creator.avatar} width={28} alt={item.creator.name} />
      <div class="flex flex-col">
        <div class="text-sm font-normal text-slate-600 dark:text-zinc-400">
          {#if item.type == 'comment_reply'}
            <Markdown
              inline
              source={$t('routes.inbox.item.reply', {
                user: `**${item.creator.name}**`,
                post: `**${escapeHtml(item.item.post.name)}**`,
              })}
              noStyle
            />
          {:else if item.type == 'person_mention'}
            <Markdown
              inline
              source={$t('routes.inbox.item.mention', {
                user: `**${item.creator.name}**`,
                post: `**${escapeHtml(item.item.post.name)}**`,
              })}
              noStyle
            />
          {:else if item.type == 'private_message'}
            <Markdown
              inline
              source={$t('routes.inbox.item.message', {
                user: `**${item.creator.name}**`,
                recipient: `**${escapeHtml(item.item.recipient.name)}**`,
              })}
              noStyle
            />
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
          icon={item.read ? EyeSlash : Eye}
        >
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
        icon={item.read ? EyeSlash : Eye}
      >
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
