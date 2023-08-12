<script lang="ts">
  import type { CommentView } from 'lemmy-js-client'
  import CommentVote from '$lib/components/lemmy/comment/CommentVote.svelte'
  import { page } from '$app/stores'
  import { userSettings } from '$lib/settings.js'
  import { Color } from '$lib/ui/colors.js'
  import {
    ArrowLeftCircle,
    ArrowUturnLeft,
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
  import { getClient, getInstance } from '$lib/lemmy.js'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { createEventDispatcher } from 'svelte'
  import { isCommentMutable } from '$lib/components/lemmy/post/helpers.js'
  import {
    amMod,
    isAdmin,
    report,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import ModerationMenu from '$lib/components/lemmy/moderation/ModerationMenu.svelte'
  import CommentModerationMenu from '$lib/components/lemmy/moderation/CommentModerationMenu.svelte'
  import { profile } from '$lib/auth.js'

  export let comment: CommentView
  export let replying: boolean = false

  async function save() {
    if (!$profile?.jwt) return

    const saved = comment.saved

    comment.saved = !saved

    try {
      await getClient().saveComment({
        auth: $profile.jwt,
        comment_id: comment.comment.id,
        save: !saved,
      })
    } catch (error) {
      comment.saved = saved

      toast({
        content: error as any,
        type: 'error',
      })
    }
  }

  const dispatcher = createEventDispatcher<{ edit: CommentView }>()
</script>

<div class="flex flex-row gap-2 items-center mt-1 h-[26px] relative">
  <CommentVote
    bind:score={comment.counts.score}
    bind:vote={comment.my_vote}
    commentId={comment.comment.id}
  />
  <Button
    color="elevatedLow"
    size="sm"
    on:click={() => (replying = !replying)}
    disabled={comment.post.locked}
  >
    <Icon src={ArrowUturnLeft} width={14} height={14} mini />
    <span class="text-xs">Reply</span>
  </Button>
  {#if $profile?.user && (amMod($profile?.user, comment.community) || isAdmin($profile.user))}
    <CommentModerationMenu bind:item={comment} />
  {/if}
  <Menu
    let:toggleOpen
    class="h-[26px] top-0 leading-3"
    alignment="bottom-center"
  >
    <Button
      slot="button"
      color="elevatedLow"
      on:click={toggleOpen}
      size="sm"
      class="!p-1"
      aria-label="Comment actions"
    >
      <Icon src={EllipsisHorizontal} width={16} height={16} mini slot="icon" />
    </Button>
    <span class="text-xs opacity-80 py-1 my-1 px-4">Comment actions</span>
    <MenuButton
      on:click={() => {
        navigator.clipboard.writeText(
          `${$page.url.origin}/post/${getInstance()}/${
            comment.post.id
          }?thread=${comment.comment.path}#${comment.comment.id}`
        )
      }}
    >
      <Icon src={Square2Stack} mini size="16" />
      <span>Copy Link</span>
    </MenuButton>
    {#if $profile?.jwt}
      {#if comment.creator.id == $profile.user?.local_user_view.person.id}
        <MenuButton on:click={() => dispatcher('edit', comment)}>
          <Icon src={PencilSquare} mini size="16" />
          <span>Edit</span>
        </MenuButton>
      {/if}
      <MenuButton on:click={save}>
        <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
        <span>{comment.saved ? 'Unsave' : 'Save'}</span>
      </MenuButton>
      {#if $profile?.user && $profile.jwt && isCommentMutable(comment, $profile.user.local_user_view)}
        <MenuButton
          color="dangerSecondary"
          on:click={async () => {
            if (!$profile?.jwt) return
            try {
              await getClient().deleteComment({
                auth: $profile.jwt,
                comment_id: comment.comment.id,
                deleted: true,
              })
              toast({
                content: 'The comment was deleted.',
                type: 'success',
              })
            } catch (error) {
              toast({
                content: 'Failed to delete comment',
                type: 'error',
              })
            }
          }}
        >
          <Icon src={Trash} mini size="16" />
          <span>Delete</span>
        </MenuButton>
      {/if}
      {#if $profile.jwt && $profile.user?.local_user_view.person.id != comment.creator.id}
        <MenuButton on:click={() => report(comment)} color="dangerSecondary">
          <Icon src={Flag} mini size="16" />
          <span>Report</span>
        </MenuButton>
      {/if}
    {/if}
  </Menu>
</div>
