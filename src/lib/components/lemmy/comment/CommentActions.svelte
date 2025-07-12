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
  import { Button, Menu, MenuButton, MenuDivider } from 'mono-svelte'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Flag,
    Icon,
    PencilSquare,
    Square2Stack,
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
  class="flex flex-row items-center gap-0.5 h-7 w-full"
  class:flex-row-reverse={settings.posts.reverseActions}
>
  <CommentVote
    upvotes={comment.counts.upvotes}
    downvotes={comment.counts.downvotes}
    vote={comment.my_vote}
    commentId={comment.comment.id}
  />
  <Button
    size="sm"
    color="tertiary"
    rounding="pill"
    class="text-slate-700 dark:text-zinc-300"
    onclick={() => (replying = !replying)}
    disabled={comment.post.locked || disabled}
  >
    <Icon src={ChatBubbleOvalLeft} size="14" micro />
    <span class="text-xs">{$t('comment.reply')}</span>
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
        size="square-sm"
        class="text-slate-700 dark:text-zinc-300"
      >
        {#snippet prefix()}
          <Icon src={EllipsisHorizontal} width={16} height={16} mini />
        {/snippet}
      </Button>
    {/snippet}
    <MenuDivider>{$t('comment.actions.label')}</MenuDivider>
    <MenuButton
      onclick={() => {
        if (navigator.share)
          navigator.share?.({
            url: comment.comment.ap_id,
          })
        else navigator.clipboard.writeText(comment.comment.ap_id)
      }}
    >
      <Icon src={Square2Stack} mini size="16" />
      <div>{$t('post.actions.more.share')}</div>
    </MenuButton>
    {#if profile.current?.jwt}
      {#if comment.creator.id == profile.current.user?.local_user_view.person.id}
        <MenuButton onclick={() => onedit?.(comment)}>
          <Icon src={PencilSquare} mini size="16" />
          <span>{$t('post.actions.more.edit')}</span>
        </MenuButton>
      {/if}
      <MenuButton
        onclick={async () => {
          if (profile.current?.jwt)
            comment.saved = await save(comment, !comment.saved)
        }}
      >
        <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
        <span>
          {comment.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
        </span>
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
          <Icon src={Trash} mini size="16" />
          <span>
            {comment.comment.deleted
              ? $t('post.actions.more.restore')
              : $t('post.actions.more.delete')}
          </span>
        </MenuButton>
      {/if}
      {#if profile.current.jwt && profile.current.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton onclick={() => report(comment)} color="danger-subtle">
          <Icon src={Flag} mini size="16" />
          <span>{$t('moderation.report')}</span>
        </MenuButton>
      {/if}
    {/if}
  </Menu>
  <div class="flex-1 w-full"></div>
</div>
