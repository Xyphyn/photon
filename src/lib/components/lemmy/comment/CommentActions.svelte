<script lang="ts">
  import type { CommentView } from 'lemmy-js-client'
  import CommentVote from '$lib/components/lemmy/comment/CommentVote.svelte'
  import {
    ArrowUturnLeft,
    Bookmark,
    BookmarkSlash,
    EllipsisHorizontal,
    Flag,
    Icon,
    PencilSquare,
    Square2Stack,
    Trash,
  } from 'svelte-hero-icons'
  import { createEventDispatcher } from 'svelte'
  import { isCommentMutable } from '$lib/components/lemmy/post/helpers.js'
  import {
    amMod,
    isAdmin,
    report,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import CommentModerationMenu from '$lib/components/lemmy/moderation/CommentModerationMenu.svelte'
  import { profile } from '$lib/auth.js'
  import { deleteItem, save } from '$lib/lemmy/contentview.js'
  import { Button, Menu, MenuButton, MenuDivider } from 'mono-svelte'
  import { t } from '$lib/translations'

  export let comment: CommentView
  export let replying: boolean = false

  const dispatcher = createEventDispatcher<{ edit: CommentView }>()

  let reply = ''
</script>

<div class="flex flex-row items-center gap-0.5 h-7 relative">
  <CommentVote
    bind:upvotes={comment.counts.upvotes}
    bind:downvotes={comment.counts.downvotes}
    bind:vote={comment.my_vote}
    commentId={comment.comment.id}
  />
  <Button
    size="sm"
    color="tertiary"
    class="text-slate-600 dark:text-zinc-400"
    on:click={() => (replying = !replying)}
    disabled={comment.post.locked}
  >
    <Icon src={ArrowUturnLeft} width={14} height={14} mini />
    <span class="text-xs">{$t('comment.reply')}</span>
  </Button>
  {#if $profile?.user && (amMod($profile?.user, comment.community) || isAdmin($profile.user))}
    <CommentModerationMenu bind:item={comment} />
  {/if}
  <Menu placement="bottom">
    <Button
      slot="target"
      class="!p-1 text-slate-600 dark:text-zinc-400"
      title={$t('comment.actions.label')}
      color="tertiary"
    >
      <Icon
        src={EllipsisHorizontal}
        width={16}
        height={16}
        mini
        slot="prefix"
      />
    </Button>
    <MenuDivider>{$t('comment.actions.label')}</MenuDivider>
    <MenuButton
      on:click={() => {
        navigator.share?.({
          url: comment.comment.ap_id,
        }) ?? navigator.clipboard.writeText(comment.comment.ap_id)
      }}
    >
      <Icon src={Square2Stack} mini size="16" />
      <div>{$t('comment.actions.link')}</div>
    </MenuButton>
    {#if $profile?.jwt}
      {#if comment.creator.id == $profile.user?.local_user_view.person.id}
        <MenuButton on:click={() => dispatcher('edit', comment)}>
          <Icon src={PencilSquare} mini size="16" />
          <span>{$t('post.actions.more.edit')}</span>
        </MenuButton>
      {/if}
      <MenuButton
        on:click={async () => {
          if ($profile?.jwt)
            comment.saved = await save(comment, !comment.saved, $profile.jwt)
        }}
      >
        <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
        <span>
          {comment.saved ? $t('post.actions.unsave') : $t('post.actions.save')}
        </span>
      </MenuButton>
      {#if $profile?.user && $profile.jwt && $profile.user.local_user_view.person.id == comment.creator.id}
        <MenuButton
          color="danger-subtle"
          on:click={async () => {
            if ($profile?.jwt)
              comment.comment.deleted = await deleteItem(
                comment,
                !comment.comment.deleted,
                $profile.jwt
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
      {#if $profile.jwt && $profile.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton on:click={() => report(comment)} color="danger-subtle">
          <Icon src={Flag} mini size="16" />
          <span>{$t('moderation.report')}</span>
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
