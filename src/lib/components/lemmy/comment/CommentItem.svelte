<script lang="ts">
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { t } from '$lib/i18n/translations'
  import type { CommentView } from '$lib/client/types'
  import { Button, Material } from 'mono-svelte'
  import { ArrowUturnUp, Icon } from 'svelte-hero-icons'
  import type { ClassValue } from 'svelte/elements'
  import { PostMeta } from '../post'

  interface Props {
    comment: CommentView
    community?: boolean
    meta?: boolean
    class?: string
    commentClass?: ClassValue
    actions?: boolean
  }

  let {
    comment,
    community = false,
    meta = true,
    class: clazz = '',
    commentClass = '',
    actions = true,
    ...rest
  }: Props = $props()
</script>

<Material
  class={['flex flex-col flex-1 rounded-none list-none', clazz]}
  color="none"
  padding="none"
>
  {#if meta}
    <div class="flex flex-row justify-between items-center gap-2">
      <div class="flex flex-col gap-2">
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
          title={comment.post.name}
          id={comment.post.id}
          titleClass="text-sm text-slate-500 dark:text-zinc-400"
        />
      </div>
      <Button
        color="primary"
        rounding="pill"
        size="sm"
        href="/comment/{comment.comment.id}"
        class="self-start"
      >
        {$t('common.jump')}
        <Icon src={ArrowUturnUp} size="14" micro />
      </Button>
    </div>
  {/if}
  <Comment
    postId={comment.post.id}
    node={{ children: [], comment_view: comment, depth: 1, expanded: true }}
    replying={false}
    {meta}
    {actions}
    {...rest}
    class={commentClass}
  />
</Material>
