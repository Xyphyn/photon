<script lang="ts">
  import type { CommentView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { Button, Menu, MenuButton } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Flag,
    PencilSquare,
    Share,
    ShieldCheck,
    Trash,
  } from 'svelte-hero-icons/dist'
  import { deleteItem, save } from '../legacy/contentview'
  import CommentModerationMenu from '../moderation/CommentModerationMenu.svelte'
  import { report } from '../moderation/moderation'
  import CommentVote from './CommentVote.svelte'

  interface Props {
    comment: CommentView
    replying?: boolean
    disabled?: boolean
    onedit?: (comment: CommentView) => void
  }

  let {
    comment = $bindable(),
    replying = $bindable(false),
    disabled = false,
    onedit,
  }: Props = $props()
</script>

<div
  class={[
    'flex flex-row items-center gap-0.5 w-full',
    settings.posts.reverseActions && 'flex-row-reverse',
  ]}
>
  <CommentVote
    upvotes={comment.counts.upvotes}
    downvotes={comment.counts.downvotes}
    vote={comment.my_vote}
    comment={comment.comment}
  />
  <Button
    color="tertiary"
    rounding="pill"
    size="sm"
    class="text-slate-500 dark:text-zinc-400 gap-1!"
    onclick={() => (replying = !replying)}
    disabled={comment.post.locked || disabled || !profile.current.jwt}
    icon={ChatBubbleOvalLeft}
  >
    {$t('comment.reply')}
  </Button>
  {#if profile.current?.user && (profile.isMod(comment.community) || profile.isAdmin)}
    <CommentModerationMenu bind:item={comment}>
      {#snippet target(attachment)}
        <Button
          {@attach attachment}
          class="dark:text-zinc-400 text-slate-600"
          color="tertiary"
          size="square-md"
          rounding="pill"
          icon={ShieldCheck}
          aria-label={$t('moderation.label')}
        />
      {/snippet}
    </CommentModerationMenu>
  {/if}
  <Menu placement="bottom">
    {#snippet target(attachment)}
      <Button
        {@attach attachment}
        title={$t('comment.actions.label')}
        color="tertiary"
        rounding="pill"
        size="square-md"
        class="text-slate-600 dark:text-zinc-400"
        icon={EllipsisHorizontal}
      ></Button>
    {/snippet}
    <MenuButton
      onclick={() => {
        if (navigator.share)
          navigator.share?.({
            url: comment.comment.ap_id,
          })
        else navigator.clipboard.writeText(comment.comment.ap_id)
      }}
      icon={Share}
    >
      {$t('post.actions.more.share')}
    </MenuButton>
    {#if profile.current?.jwt}
      {#if comment.creator.id == profile.current.user?.local_user_view.person.id}
        <MenuButton onclick={() => onedit?.(comment)} icon={PencilSquare}>
          {$t('post.actions.more.edit')}
        </MenuButton>
      {/if}
      <MenuButton
        onclick={async () => {
          if (profile.current?.jwt)
            comment.saved = await save(comment, !comment.saved)
        }}
        icon={comment.saved ? BookmarkSlash : Bookmark}
      >
        {comment.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
      </MenuButton>
      {#if profile.current?.user && profile.current.jwt && profile.current.user.local_user_view.person.id == comment.creator.id}
        <MenuButton
          color="danger-subtle"
          onclick={async () => {
            if (profile.current?.jwt)
              comment.comment.deleted = await deleteItem(
                comment,
                !comment.comment.deleted,
              )
          }}
          icon={Trash}
        >
          {comment.comment.deleted
            ? $t('post.actions.more.restore')
            : $t('post.actions.more.delete')}
        </MenuButton>
      {/if}
      {#if profile.current.jwt && profile.current.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton
          onclick={() => report(comment)}
          color="danger-subtle"
          icon={Flag}
        >
          {$t('moderation.report')}
        </MenuButton>
      {/if}
    {/if}
  </Menu>
  <div class="flex-1 w-full"></div>
</div>
