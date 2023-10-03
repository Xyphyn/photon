<script lang="ts">
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import { Check, Icon } from 'svelte-hero-icons'
  import { Material } from 'mono-svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { Button } from 'mono-svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import type { InboxItem } from '$lib/lemmy/inbox.js'
  import PrivateMessage from '$lib/components/lemmy/inbox/PrivateMessage.svelte'
  import PrivateMessageModal from '$lib/components/lemmy/modal/PrivateMessageModal.svelte'

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
    if ($profile.user) $profile.user.unreads += isRead ? -1 : 1

    loading = false
  }
</script>

{#if replying && item.type == 'private_message'}
  <PrivateMessageModal bind:open={replying} user={item.item.creator} />
{/if}

<Material padding="lg" class="flex flex-col max-w-full gap-2">
  <div class="flex flex-col gap-1">
    <span class="text-xs text-slate-600 dark:text-zinc-400">
      <RelativeDate date={publishedToDate(item.published)} />
    </span>
    {#if item.type != 'private_message'}
      <PostMeta title={item.item.post.name} id={item.item.post.id} />
    {/if}
  </div>
  <div class="flex flex-col">
    <SectionTitle class="mb-2 text-xs">
      {#if item.type == 'private_message'}
        Message
      {:else if item.type == 'person_mention'}
        Mention
      {:else if item.type == 'comment_reply'}
        Reply
      {/if}
    </SectionTitle>
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
    {#if item.type == 'private_message'}
      <PrivateMessage message={item.item} />
    {:else}
      <Comment
        postId={item.item.post.id}
        node={{ children: [], comment_view: item.item, depth: 1 }}
        replying={false}
        class="!p-0"
      />
    {/if}
  </div>
  <div class="flex flex-row ml-auto gap-2 h-8">
    <Button
      class={item.read ? '!text-green-500' : ''}
      size="square-md"
      {loading}
      disabled={loading}
      on:click={() => markAsRead(!item.read)}
    >
      <Icon slot="prefix" src={Check} mini size="16" />
    </Button>

    {#if item.type == 'private_message'}
      {#if item.item.creator.id != $profile?.user?.local_user_view.person.id}
        <Button size="md" on:click={() => (replying = !replying)}>Reply</Button>
      {/if}
    {:else}
      <Button href="/comment/{item.item.comment.id}" size="md" class="h-full">
        Jump
      </Button>
    {/if}
  </div>
</Material>
