<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import type {
    CommentReplyView,
    PersonMentionView,
    PrivateMessageView,
  } from 'lemmy-js-client'

  export let item: CommentReplyView | PersonMentionView
  export let read: boolean
</script>

<Card class="flex flex-col bg-white rounded-md p-4 max-w-full">
  <div class="flex flex-row items-center">
    <div
      class="text-sm max-w-[80ch] whitespace-nowrap text-ellipsis
      overflow-hidden {read ? 'opacity-50' : ''}"
    >
      <span class="font-bold">
        {item.creator.display_name ?? item.creator.name}
      </span>
      replied to you in
      <a
        href="/post/{item.post.id}"
        class="font-bold max-w-[48ch] overflow-hidden text-ellipsis
      whitespace-nowrap inline hover:underline"
      >
        {item.post.name}
      </a>
    </div>

    <div class="w-max ml-auto">
      <Link href="/post/{item.post.id}#{item.comment.id}">Jump</Link>
    </div>
  </div>
  <div>
    <Comment
      postId={item.post.id}
      node={{ children: [], comment_view: item, depth: 1 }}
      replying={false}
    />
  </div>
</Card>
