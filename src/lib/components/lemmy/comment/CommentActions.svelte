<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import CommentVote from '$lib/components/lemmy/comment/CommentVote.svelte'
  import CommentModerationMenu from '$lib/components/lemmy/moderation/CommentModerationMenu.svelte'
  import {
    amMod,
    isAdmin,
    report,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import { t } from '$lib/i18n/translations'
  import { deleteItem, save } from '$lib/lemmy/contentview.js'
  import { settings } from '$lib/settings.svelte'
  import type { CommentView } from 'lemmy-js-client'
  import { Button, Menu, MenuButton } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Flag,
    Icon,
    PencilSquare,
    Share,
    Trash,
  } from 'svelte-hero-icons'

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
    'flex flex-row items-center gap-0.5 h-7 w-full',
    settings.posts.reverseActions && 'flex-row-reverse',
  ]}
>
  <CommentVote
    upvotes={comment.counts.upvotes}
    downvotes={comment.counts.downvotes}
    vote={comment.my_vote}
    commentId={comment.comment.id}
  />
  <Button
    color="tertiary"
    rounding="pill"
    size="sm"
    class="text-slate-500 dark:text-zinc-400"
    onclick={() => (replying = !replying)}
    disabled={comment.post.locked || disabled || !profile.current.jwt}
  >
    <Icon src={ChatBubbleOvalLeft} size="15" micro />
    {$t('comment.reply')}
  </Button>
  {#if profile.current?.user && (amMod(profile.current?.user, comment.community) || isAdmin(profile.current.user))}
    <CommentModerationMenu bind:item={comment} />
  {/if}
  <Menu placement="bottom">
    {#snippet target()}
      <Button
        title={$t('comment.actions.label')}
        color="tertiary"
        rounding="pill"
        size="square-md"
        class="text-slate-600 dark:text-zinc-400"
      >
        {#snippet prefix()}
          <Icon src={EllipsisHorizontal} size="16" micro />
        {/snippet}
      </Button>
    {/snippet}
    <MenuButton
      onclick={() => {
        if (navigator.share)
          navigator.share?.({
            url: comment.comment.ap_id,
          })
        else navigator.clipboard.writeText(comment.comment.ap_id)
      }}
    >
      {#snippet prefix()}
        <Icon src={Share} mini size="16" />
      {/snippet}
      {$t('post.actions.more.share')}
    </MenuButton>
    {#if profile.current?.jwt}
      {#if comment.creator.id == profile.current.user?.local_user_view.person.id}
        <MenuButton onclick={() => onedit?.(comment)}>
          {#snippet prefix()}
            <Icon src={PencilSquare} mini size="16" />
          {/snippet}
          {$t('post.actions.more.edit')}
        </MenuButton>
      {/if}
      <MenuButton
        onclick={async () => {
          if (profile.current?.jwt)
            comment.saved = await save(comment, !comment.saved)
        }}
      >
        {#snippet prefix()}
          <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
        {/snippet}
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
        >
          {#snippet prefix()}
            <Icon src={Trash} mini size="16" />
          {/snippet}
          {comment.comment.deleted
            ? $t('post.actions.more.restore')
            : $t('post.actions.more.delete')}
        </MenuButton>
      {/if}
      {#if profile.current.jwt && profile.current.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton onclick={() => report(comment)} color="danger-subtle">
          {#snippet prefix()}
            <Icon src={Flag} mini size="16" />
          {/snippet}
          {$t('moderation.report')}
        </MenuButton>
      {/if}
    {/if}
  </Menu>
  <div class="flex-1 w-full"></div>
</div>
