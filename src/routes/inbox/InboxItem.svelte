<script lang="ts">
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import {
    ArrowUturnLeft,
    ArrowUturnUp,
    AtSymbol,
    ChatBubbleOvalLeft,
    Check,
    Envelope,
    Icon,
  } from 'svelte-hero-icons'
  import { Material } from 'mono-svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { Button } from 'mono-svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import type { InboxItem } from '$lib/lemmy/inbox.js'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import PrivateMessageModal from '$lib/components/lemmy/modal/PrivateMessageModal.svelte'
  import { t } from '$lib/translations'

  export let item: InboxItem

  let replying = false
  let reply = ''
  let loading = false

  async function markAsRead(isRead: boolean) {
    if (!$profile?.jwt) return

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
    if ($profile.user) $profile.user.notifications.inbox += isRead ? -1 : 1

    loading = false
  }
</script>

{#if replying && item.type == 'private_message'}
  <PrivateMessageModal bind:open={replying} user={item.item.creator} />
{/if}

<Material
  class="flex flex-col max-w-full gap-4"
  color="transparent"
  rounding="xl"
>
  <div class="meta w-full">
    <div
      class="rounded-full p-1 h-10 w-10 border border-slate-200 dark:border-zinc-800 grid place-items-center"
      style="grid-area: a;"
    >
      <Icon
        src={item.type == 'private_message'
          ? Envelope
          : item.type == 'comment_reply'
            ? ChatBubbleOvalLeft
            : AtSymbol}
        size="24"
      />
    </div>
    <RelativeDate
      class="text-xs text-slate-600 dark:text-zinc-400"
      date={publishedToDate(item.published)}
      style="grid-area: b;"
    />
    {#if item.type != 'private_message'}
      <PostMeta title={item.item.post.name} id={item.item.post.id} />
    {:else}
      <PrivateMessage message={item.item} style="grid-area: title;" />
    {/if}
    <div class="flex flex-row gap-2 h-8" style="grid-area: actions;">
      {#if !(item.type == 'private_message' && item.item.creator.id == $profile?.user?.local_user_view.person.id)}
        <Button
          class={item.read ? '!text-green-500' : ''}
          size="square-md"
          {loading}
          disabled={loading}
          on:click={() => markAsRead(!item.read)}
          title={$t('post.actions.more.markRead')}
        >
          <Icon slot="prefix" src={Check} mini size="16" />
        </Button>
      {/if}

      {#if item.type == 'private_message'}
        {#if item.item.creator.id != $profile?.user?.local_user_view.person.id}
          <Button size="square-md" on:click={() => (replying = !replying)}>
            <Icon src={ArrowUturnLeft} size="16" mini />
          </Button>
        {/if}
      {:else}
        <Button
          title={$t('common.jump')}
          href="/comment/{item.item.comment.id}"
          size="square-md"
        >
          <Icon src={ArrowUturnUp} mini size="16" />
        </Button>
      {/if}
    </div>
  </div>
  <div class="flex flex-col">
    {#if item.type != 'private_message' && $profile?.user && item.item.post.creator_id != $profile.user.local_user_view.person.id}
      <div class="flex flex-row text-xs items-center gap-2">
        <div
          class="border-t w-8 rounded-tl h-2 border-l ml-2 border-zinc-700"
        />
        <div>
          <UserLink
            avatar
            avatarSize={16}
            user={$profile.user.local_user_view.person}
          />
        </div>
      </div>
    {/if}
    {#if item.type != 'private_message'}
      <Comment
        postId={item.item.post.id}
        node={{ children: [], comment_view: item.item, depth: 1 }}
        replying={false}
        class="!p-0"
      />
    {/if}
  </div>
</Material>

<style>
  .meta {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto 1fr;
    column-gap: 0.5rem;
    grid-template-areas:
      'a b     actions'
      'a title actions';
  }
</style>
