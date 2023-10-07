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

  export let comment: CommentView
  export let replying: boolean = false

  const dispatcher = createEventDispatcher<{ edit: CommentView }>()
</script>

<div class="flex flex-row items-center gap-0.5 mt-1 h-7 relative">
  <CommentVote
    bind:score={comment.counts.score}
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
    <span class="text-xs">Reply</span>
  </Button>
  {#if $profile?.user && (amMod($profile?.user, comment.community) || isAdmin($profile.user))}
    <CommentModerationMenu bind:item={comment} />
  {/if}
  <Menu placement="bottom">
    <Button
      slot="target"
      class="!p-1 text-slate-600 dark:text-zinc-400"
      aria-label="Comment actions"
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
    <MenuDivider>Actions</MenuDivider>
    <MenuButton
      on:click={() => {
        navigator.share?.({
          url: comment.comment.ap_id,
        }) ?? navigator.clipboard.writeText(comment.comment.ap_id)
      }}
    >
      <Icon src={Square2Stack} mini size="16" />
      <divv>Copy Link</divv>
    </MenuButton>
    {#if $profile?.jwt}
      {#if comment.creator.id == $profile.user?.local_user_view.person.id}
        <MenuButton on:click={() => dispatcher('edit', comment)}>
          <Icon src={PencilSquare} mini size="16" />
          <span>Edit</span>
        </MenuButton>
      {/if}
      <MenuButton
        on:click={async () => {
          if ($profile?.jwt)
            comment.saved = await save(comment, !comment.saved, $profile.jwt)
        }}
      >
        <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
        <span>{comment.saved ? 'Unsave' : 'Save'}</span>
      </MenuButton>
      {#if $profile?.user && $profile.jwt && isCommentMutable(comment, $profile.user.local_user_view)}
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
          <span>{comment.comment.deleted ? 'Restore' : 'Delete'}</span>
        </MenuButton>
      {/if}
      {#if $profile.jwt && $profile.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton on:click={() => report(comment)} color="danger-subtle">
          <Icon src={Flag} mini size="16" />
          <span>Report</span>
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
