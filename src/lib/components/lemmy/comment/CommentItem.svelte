<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { getInstance } from '$lib/lemmy.js'
  import type { CommentView } from 'lemmy-js-client'

  export let comment: CommentView
</script>

<Card class="flex flex-col bg-white rounded-md p-5 flex-1 gap-1">
  <div class="flex flex-row justify-between items-center">
    <PostMeta
      community={comment.community}
      deleted={false}
      featured={false}
      nsfw={comment.post.nsfw}
      published={new Date(comment.post.published + 'Z')}
      saved={false}
    />
    <Button
      color="secondary"
      href="/post/{comment.post.id}?thread={comment.comment.path}#{comment
        .comment.id}"
      size="sm"
      class="self-start"
    >
      Jump
    </Button>
  </div>
  <a
    href="/post/{getInstance()}/{comment.post.id}"
    class="font-medium text-base"
  >
    {comment.post.name}
  </a>
  <div class="list-none">
    <Comment
      postId={comment.post.id}
      node={{ children: [], comment_view: comment, depth: 1 }}
      replying={false}
    />
  </div>
</Card>
