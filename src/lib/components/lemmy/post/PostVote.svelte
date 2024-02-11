<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import type { Post } from 'lemmy-js-client'
  import {
    ArrowDown,
    ArrowUp,
    ChevronDown,
    ChevronUp,
    Icon,
    Key,
  } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { Button, Popover, buttonColor, toast } from 'mono-svelte'
  import { site } from '$lib/lemmy.js'
  import { fly } from 'svelte/transition'
  import { userSettings } from '$lib/settings.js'

  export let post: Post
  export let vote: number = 0
  export let score: number
  export let upvotes: number = 0
  export let downvotes: number = 0

  let oldScore = score

  const voteColor = (vote: number, border: boolean = false) =>
    vote == 1 ? `!text-blue-500` : vote == -1 ? `!text-red-500` : ''

  const shouldShowVoteColor = (
    vote: number,
    type: 'upvotes' | 'downvotes'
  ): string =>
    (vote == -1 && type == 'downvotes') ||
    (vote == 1 && type == 'upvotes') ||
    !$userSettings.separateVotes
      ? voteColor(vote)
      : ''

  const castVote = async (newVote: number) => {
    if (!$profile?.jwt) {
      toast({ content: 'You must be logged in to vote.', type: 'warning' })
      return
    }
    oldScore = score
    vote = newVote
    const res = await voteItem(post, newVote, $profile.jwt)
    ;({ upvotes, downvotes, score } = res)
  }
</script>

<slot {vote} {score}>
  <div
    class="{buttonColor.secondary} rounded-lg h-full flex items-center [&>*]:p-2
    hover:bg-white hover:dark:bg-zinc-900 overflow-hidden"
  >
    <button
      on:click={() => castVote(vote == 1 ? 0 : 1)}
      class="flex items-center gap-0.5 {buttonColor.secondary} transition-colors border-0
      {vote == 1 ? shouldShowVoteColor(vote, 'upvotes') : ''}"
    >
      <Icon src={ChevronUp} size="18" mini />
      <span class="grid text-sm">
        {#key upvotes}
          <span
            style="grid-column: 1; grid-row: 1;"
            in:fly={{ duration: 200, y: -6 }}
            out:fly={{ duration: 200, y: 6 }}
          >
            <FormattedNumber number={upvotes} />
          </span>
        {/key}
      </span>
    </button>
    <div
      class="border-l h-6 w-0 !p-0 border-slate-200 dark:border-zinc-800"
    ></div>
    <button
      on:click={() => castVote(vote == -1 ? 0 : -1)}
      class="flex items-center gap-0.5 !pr-2.5 {buttonColor.secondary} transition-colors border-0
      {vote == -1 ? shouldShowVoteColor(vote, 'downvotes') : ''}"
    >
      <Icon src={ChevronDown} size="18" mini />
      <span class="grid text-sm">
        {#key downvotes}
          <span
            style="grid-column: 1; grid-row: 1;"
            in:fly={{ duration: 200, y: -6 }}
            out:fly={{ duration: 200, y: 6 }}
          >
            <FormattedNumber number={downvotes} />
          </span>
        {/key}
      </span>
    </button>
  </div>
</slot>
