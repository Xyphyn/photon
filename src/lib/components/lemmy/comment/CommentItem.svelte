<script lang="ts">
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { getInstance } from '$lib/lemmy.js'
  import { userSettings } from '$lib/settings.js'
  import type { CommentView } from 'lemmy-js-client'
  import { Button, Material } from 'mono-svelte'
  import { ArrowUturnUp, Icon } from 'svelte-hero-icons'

  export let comment: CommentView
  export let view = $userSettings.view
  export let community = false
</script>

<Material
  class="flex flex-col flex-1 {view != 'card'
    ? '!bg-transparent !border-0 rounded-none'
    : 'p-5'} {view == 'list' ? 'py-5' : view == 'compact' ? 'py-4' : 'py-5'}"
  color="distinct"
  padding="none"
>
  <div class="flex flex-row justify-between items-center gap-2">
    <PostMeta
      badges={{
        nsfw: comment.post.nsfw,
        removed: comment.post.removed,
        admin: false,
        moderator: false,
        saved: false,
        deleted: comment.post.deleted,
        featured:
          comment.post.featured_community || comment.post.featured_local,
        locked: comment.post.locked,
      }}
      published={publishedToDate(comment.comment.published)}
      community={community ? comment.community : undefined}
    />
    <Button
      color="secondary"
      href="/post/{comment.post.id}?thread={comment.comment.path}#{comment
        .comment.id}"
      size="square-md"
      class="self-start"
      title="Jump"
    >
      <Icon src={ArrowUturnUp} size="16" mini />
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
</Material>
