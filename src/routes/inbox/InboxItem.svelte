<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { Color } from '$lib/ui/colors.js'
  import type {
    CommentReplyView,
    PersonMentionView,
    PrivateMessageView,
  } from 'lemmy-js-client'
  import { ChatBubbleOvalLeft, Icon } from 'svelte-hero-icons'
  import { page } from '$app/stores'

  export let item: CommentReplyView | PersonMentionView | PrivateMessageView
  export let read: boolean

  function isPrivateMessage(
    item: CommentReplyView | PersonMentionView | PrivateMessageView
  ) {
    return 'private_message' in item
  }

  // I hate how you can't type cast in Svelte easily
  const replyItem = item as CommentReplyView | PersonMentionView
  const messageItem = item as PrivateMessageView

  let replying = false
  let reply = ''
  let loading = false

  async function replyToMessage() {
    if (!$authData) return

    loading = true

    try {
      await getClient().createPrivateMessage({
        auth: $authData.token,
        content: reply,
        recipient_id: messageItem.creator.id,
      })

      addToast(
        'Success',
        'Successfully replied to that message.',
        ToastType.success
      )

      replying = false

      goto($page.url, {
        invalidateAll: true,
        replaceState: true,
      })
    } catch (error) {
      addToast('Error', error as any, ToastType.error)
    }

    loading = false
  }
</script>

<Card class="flex flex-col bg-white rounded-md p-4 max-w-full">
  {#if !isPrivateMessage(item)}
    <div class="flex flex-row items-center">
      <div
        class="text-sm max-w-[80ch] whitespace-nowrap text-ellipsis
      overflow-hidden {read ? 'opacity-50' : ''}"
      >
        <span class="font-bold">
          {replyItem.creator.display_name ?? replyItem.creator.name}
        </span>
        replied to you in
        <a
          href="/post/{replyItem.post.id}"
          class="font-bold max-w-[48ch] overflow-hidden text-ellipsis
      whitespace-nowrap inline hover:underline"
        >
          {replyItem.post.name}
        </a>
      </div>

      <div class="w-max ml-auto">
        <Link href="/post/{replyItem.post.id}#{replyItem.comment.id}">
          Jump
        </Link>
      </div>
    </div>
    <div>
      <Comment
        postId={replyItem.post.id}
        node={{ children: [], comment_view: replyItem, depth: 1 }}
        replying={false}
      />
    </div>
  {:else}
    <div class="flex flex-row items-center">
      <div
        class="text-sm max-w-[80ch] whitespace-nowrap text-ellipsis
    overflow-hidden flex flex-row items-center gap-1 {read ? 'opacity-80' : ''}"
      >
        <span class="font-bold">
          {#if messageItem.creator.id == $user?.person_view.person.id}
            You
          {:else}
            <UserLink avatar user={messageItem.creator} />
          {/if}
        </span>
        <span>messaged</span>
        <span class="font-bold">
          {#if messageItem.recipient.id == $user?.person_view.person.id}
            You
          {:else}
            <UserLink avatar user={messageItem.recipient} />
          {/if}
        </span>
      </div>
    </div>
    <p class="text-sm py-2">
      <Markdown source={messageItem.private_message.content} />
    </p>
    {#if messageItem.recipient.id == $user?.person_view.person.id}
      <div class="flex flex-row gap-2">
        <Button color={Color.ghost} on:click={() => (replying = !replying)}>
          <Icon mini src={ChatBubbleOvalLeft} width={16} />
          Reply
        </Button>
      </div>
    {/if}
    {#if replying}
      <div class="mt-2 flex flex-col gap-2">
        <TextArea placeholder="Message" bind:value={reply} rows={3} />
        <div class="ml-auto w-24">
          <Button
            disabled={loading}
            {loading}
            large
            on:click={replyToMessage}
            color={Color.accent}
          >
            Submit
          </Button>
        </div>
      </div>
    {/if}
  {/if}
</Card>
