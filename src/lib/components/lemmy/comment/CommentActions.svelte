<script lang="ts">
  import type { CommentView } from 'lemmy-js-client'
  import CommentVote from '$lib/components/lemmy/comment/CommentVote.svelte'
  import { userSettings } from '$lib/settings.js'
  import { Color } from '$lib/ui/colors.js'
  import {
    Bookmark,
    BookmarkSlash,
    ChatBubbleOvalLeft,
    EllipsisHorizontal,
    Icon,
  } from 'svelte-hero-icons'
  import { authData, getClient } from '$lib/lemmy.js'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'

  export let comment: CommentView
  export let replying: boolean = false

  async function save() {
    if (!$authData) return

    const saved = comment.saved

    comment.saved = !saved

    try {
      await getClient().saveComment({
        auth: $authData.token,
        comment_id: comment.comment.id,
        save: !saved,
      })
    } catch (error) {
      comment.saved = saved

      toast({
        content: error as any,
        type: ToastType.error,
      })
    }
  }
</script>

<div class="flex flex-row gap-2 items-center mt-1 h-[26px] relative">
  <CommentVote
    bind:score={comment.counts.score}
    bind:vote={comment.my_vote}
    commentId={comment.comment.id}
  />
  <button
    class="{$userSettings.newComments
      ? Color.borderDark
      : 'hover:bg-slate-200 hover:dark:bg-zinc-800'} h-full px-2 flex flex-row items-center gap-1
    rounded-md transition-colors"
    on:click={() => (replying = !replying)}
  >
    <Icon src={ChatBubbleOvalLeft} width={16} height={16} mini />
    <span class="text-xs">Reply</span>
  </button>
  <div class="h-full relative">
    <Menu let:toggleOpen class="h-[26px] top-0" absolute origin="bottom-center">
      <button
        slot="button"
        class="{Color.borderDark} h-full px-1 flex flex-row items-center gap-1
      rounded-md transition-colors"
        on:click={toggleOpen}
      >
        <Icon src={EllipsisHorizontal} width={16} height={16} mini />
      </button>
      <span class="opacity-80 my-1 py-1 text-xs mx-4">Comment actions</span>
      {#if $authData?.token}
        <MenuButton on:click={save}>
          <Icon src={comment.saved ? BookmarkSlash : Bookmark} mini size="16" />
          <span>{comment.saved ? 'Unsave' : 'Save'}</span>
        </MenuButton>
      {/if}
    </Menu>
  </div>
</div>
