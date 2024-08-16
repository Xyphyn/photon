<script lang="ts">
  import {
    ArrowDownCircle,
    ArrowUp,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { getClient, site } from '$lib/lemmy'
  import { userSettings } from '$lib/settings'
  import { profile } from '$lib/auth.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button, buttonColor, toast } from 'mono-svelte'
  import { vote as voteItem } from '$lib/lemmy/contentview'
  import { shouldShowVoteColor } from '../post/PostVote.svelte'
  import { fly } from 'svelte/transition'
  import { backOut } from 'svelte/easing'
  import { t } from '$lib/translations'

  export let vote: number = 0
  export let upvotes: number
  export let downvotes: number
  export let commentId: number

  const castVote = async (newVote: number) => {
    if (!$profile?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }

    vote = newVote
    const res = await getClient().likeComment({
      comment_id: commentId,
      score: vote,
    })
    ;({ upvotes, downvotes } = res.comment_view.counts)
  }
</script>

<div
  class="h-full flex items-center overflow-hidden {buttonColor.ghost} rounded-full hover:bg-transparent"
>
  <button
    on:click={() => castVote(vote == 1 ? 0 : 1)}
    class="flex items-center gap-0.5 transition-colors px-1.5 h-full {buttonColor.tertiary}
      {vote == 1 ? shouldShowVoteColor(vote, 'upvotes') : ''}"
  >
    <Icon src={ChevronUp} size="18" mini />
    <span class="grid text-sm">
      {#key upvotes}
        <span
          style="grid-column: 1; grid-row: 1;"
          in:fly={{ duration: 400, y: -10, easing: backOut }}
          out:fly={{ duration: 400, y: 10, easing: backOut }}
        >
          <FormattedNumber number={upvotes} />
        </span>
      {/key}
    </span>
  </button>
  <div
    class="border-l h-4 w-0 !p-0 border-slate-200 dark:border-zinc-800"
  ></div>
  <button
    on:click={() => castVote(vote == -1 ? 0 : -1)}
    class="flex flex-row-reverse items-center gap-0.5 h-full {buttonColor.tertiary} transition-colors border-0 px-1.5
      {vote == -1 ? shouldShowVoteColor(vote, 'downvotes') : ''}"
  >
    <Icon src={ChevronDown} size="18" mini />
    <span class="grid text-sm">
      {#key downvotes}
        <span
          style="grid-column: 1; grid-row: 1;"
          in:fly={{ duration: 400, y: -10, easing: backOut }}
          out:fly={{ duration: 400, y: 10, easing: backOut }}
        >
          <FormattedNumber number={downvotes} />
        </span>
      {/key}
    </span>
  </button>
</div>
