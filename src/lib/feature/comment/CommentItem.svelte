<script lang="ts">
  import type { CommentView } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Button, Material } from 'mono-svelte'
  import { ArrowUturnUp, Icon } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'
  import { PostMeta } from '../post'
  import Comment from './Comment.svelte'

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
