<script lang="ts">
  import { goto } from '$app/navigation'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import type {
    CommentReplyView,
    PersonMentionView,
    PrivateMessageView,
  } from 'lemmy-js-client'
  import { ChatBubbleOvalLeft, Check, Icon } from 'svelte-hero-icons'
  import { page } from '$app/stores'
  import { Material, toast } from 'mono-svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { Button } from 'mono-svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'

  export let item: CommentReplyView | PersonMentionView | PrivateMessageView
  export let read: boolean

  function isPrivateMessage(
    item: CommentReplyView | PersonMentionView | PrivateMessageView
  ): item is PrivateMessageView {
    return 'private_message' in item
  }

  let replying = false
  let reply = ''
  let loading = false

  async function replyToMessage(
    message: PrivateMessageView | CommentReplyView | PersonMentionView
  ) {
    if (!$profile?.jwt) return

    loading = true

    try {
      await getClient().createPrivateMessage({
        auth: $profile.jwt,
        content: reply,
        recipient_id: message.creator.id,
      })

      toast({
        content: 'Successfully replied to that message.',
        type: 'success',
      })

      replying = false

      goto($page.url, {
        invalidateAll: true,
        replaceState: true,
      })
    } catch (error) {
      toast({ content: error as any, type: 'error' })
    }

    loading = false
  }

  async function markAsRead(isRead: boolean) {
    if (!$profile?.jwt) return

    loading = true

    if ('person_mention' in item) {
      await getClient().markPersonMentionAsRead({
        auth: $profile?.jwt,
        person_mention_id: item.person_mention.id,
        read: isRead,
      })
    } else if ('comment_reply' in item) {
      await getClient().markCommentReplyAsRead({
        auth: $profile?.jwt,
        comment_reply_id: item.comment_reply.id,
        read: isRead,
      })
    }

    read = isRead
    if ($profile.user) $profile.user.unreads += isRead ? -1 : 1

    loading = false
  }
</script>

<Material padding="lg" class="flex flex-col max-w-full gap-2">
  {#if !isPrivateMessage(item)}
    <PostMeta
      published={new Date(item.post.published)}
      title={item.post.name}
      id={item.post.id}
    />
    <div
      class="flex flex-col"
      class:mt-2={$profile?.user &&
        item.post.creator_id != $profile.user.local_user_view.person.id}
    >
      <SectionTitle class="mb-2 text-xs">Reply</SectionTitle>
      {#if $profile?.user && item.post.creator_id != $profile.user.local_user_view.person.id}
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
      <Comment
        postId={item.post.id}
        node={{ children: [], comment_view: item, depth: 1 }}
        replying={false}
        class="!p-0"
      />
    </div>
    <div class="flex flex-row ml-auto gap-2">
      <Button
        class={read ? '!text-green-500' : ''}
        size="square-md"
        {loading}
        disabled={loading}
        on:click={() => markAsRead(!read)}
      >
        <Icon slot="prefix" src={Check} mini size="16" />
      </Button>

      <Button href="/comment/{item.comment.id}" size="md" class="h-8">
        Jump
      </Button>
    </div>
  {:else}
    <div class="flex flex-row items-center">
      <div
        class="text-sm max-w-[80ch] whitespace-nowrap text-ellipsis
    overflow-hidden flex flex-row items-center gap-1 {read ? 'opacity-80' : ''}"
      >
        <span class="font-bold flex items-center">
          {#if item.creator.id == $profile?.user?.local_user_view.person.id}
            You
          {:else}
            <UserLink avatar user={item.creator} />
          {/if}
        </span>
        <span>messaged</span>
        <span class="font-bold flex items-center">
          {#if item.recipient.id == $profile?.user?.local_user_view.person.id}
            You
          {:else}
            <UserLink avatar user={item.recipient} />
          {/if}
        </span>
      </div>
    </div>
    <p class="text-sm py-2">
      <Markdown source={item.private_message.content} />
    </p>
    {#if item.recipient.id == $profile?.user?.local_user_view.person.id}
      <div class="flex flex-row gap-2">
        <Button color="ghost" on:click={() => (replying = !replying)}>
          <Icon mini src={ChatBubbleOvalLeft} width={16} />
          Reply
        </Button>
      </div>
    {/if}
    {#if isPrivateMessage(item)}
      {#if replying}
        <div class="mt-2 flex flex-col gap-2">
          <MarkdownEditor placeholder="Message" bind:value={reply} rows={4} />
          <div class="ml-auto w-24">
            <Button
              disabled={loading}
              {loading}
              on:click={() => replyToMessage(item)}
              color="primary"
              size="sm"
            >
              Submit
            </Button>
          </div>
        </div>
      {/if}
    {/if}
  {/if}
</Material>
