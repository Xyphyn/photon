<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { escapeHtml, loader } from '$lib/app/util.svelte'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import PrivateMessage from '$lib/feature/inbox/PrivateMessage.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Button, ButtonGroup, Expandable, Material } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import {
    AtSymbol,
    ChatBubbleOvalLeftEllipsis,
    Eye,
    EyeSlash,
    Icon,
    PaperAirplane,
    ShieldCheck,
  } from 'svelte-hero-icons/dist'
  import ModlogItemCard from '../../../routes/modlog/item/ModlogItemCard.svelte'
  import { CommentModel } from '../comment/comment.svelte'
  import { PostItem } from '../post'
  import type { InboxItemModel } from './inbox-item.svelte'

  interface Props {
    item: InboxItemModel
  }

  let { item = $bindable() }: Props = $props()

  let loading = $state(false)

  const markRead = (read: boolean = !item.read) =>
    loader(
      (v) => (loading = v),
      () => item.markRead(read),
      () => {
        if (profile.current.user) profile.inbox.notifications.inbox += item.read ? -1 : 1
      },
    )
</script>

{#snippet actions()}
  <Button
    color={item.notification.read ? 'secondary' : 'primary'}
    {loading}
    disabled={loading ||
      item.notification.creator_id == profile.current.user?.local_user_view.person.id}
    onclick={(e: MouseEvent) => {
      e.stopPropagation()
      markRead()
    }}
    size="sm"
    rounding="pill"
    class="shrink-0"
    icon={item.notification.read ? EyeSlash : Eye}
  >
    {item.notification.read ? $t('post.actions.more.markUnread') : $t('post.actions.more.markRead')}
  </Button>
  <Button
    href={item.data.type_ == 'private_message'
      ? `/inbox/messages/${item.notification.creator_id}`
      : `/comment/${item.notification.comment_id}`}
    size="sm"
    rounding="pill"
    class="shrink-0"
    onclick={() => markRead(true)}
  >
    {$t('common.jump')}
  </Button>
{/snippet}

<Expandable open icon={false}>
  {#snippet title()}
    <div class="flex flex-row gap-2 items-center w-full">
      <div class="relative">
        {#if item.data.type_ == 'comment' || item.data.type_ == 'post' || item.data.type_ == 'private_message'}
          <Avatar url={item.data.creator.avatar} width={28} alt={item.data.creator.name} />
        {/if}
        <Material
          color="uniform"
          padding="none"
          class="absolute -bottom-2 -right-2 p-1"
          rounding="full"
        >
          <Icon
            src={item.notification.kind == 'reply'
              ? ChatBubbleOvalLeftEllipsis
              : item.notification.kind == 'mention'
                ? AtSymbol
                : item.notification.kind == 'private_message'
                  ? PaperAirplane
                  : ShieldCheck}
            size="12"
            micro
          />
        </Material>
      </div>
      <div class="flex flex-col">
        <div class="text-sm font-normal text-slate-600 dark:text-zinc-400">
          {#if item.data.type_ == 'comment' || item.data.type_ == 'post'}
            <Markdown
              inline
              source={$t('routes.inbox.item.reply', {
                user: `**${item.data.creator.name}**`,
                post: `**${escapeHtml(item.data.post.name)}**`,
              })}
              noStyle
            />
          {:else if item.data.type_ == 'private_message'}
            <Markdown
              inline
              source={$t('routes.inbox.item.message', {
                user: `**${item.data.creator.name}**`,
                recipient: `**${escapeHtml(item.data.recipient.name)}**`,
              })}
              noStyle
            />
          {/if}
        </div>
        <div class="text-xs text-slate-600 dark:text-zinc-400">
          <RelativeDate date={publishedToDate(item.notification.published_at)} />
        </div>
      </div>
      <div class="flex-1"></div>
      <ButtonGroup orientation="horizontal" class="md:flex hidden shrink-0">
        {@render actions()}
      </ButtonGroup>
    </div>
  {/snippet}
  {#snippet extended()}
    <ButtonGroup orientation="horizontal" class="flex md:hidden">
      {@render actions()}
    </ButtonGroup>
  {/snippet}
  {#snippet content()}
    {#if item.data.type_ == 'comment'}
      <CommentItem
        comment={new CommentModel(item.data)}
        community={false}
        meta={false}
        class="py-0!"
        commentClass="py-0!"
      />
    {:else if item.data.type_ == 'post'}
      <PostItem post={item.data} />
    {:else if item.data.type_ == 'private_message'}
      <PrivateMessage message={item.data} meta={false} />
    {:else if item.data.type_ == 'mod_action'}
      <ModlogItemCard item={item.data.modlog} />
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
