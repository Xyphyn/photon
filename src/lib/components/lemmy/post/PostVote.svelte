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
  import { Button, Popover, toast } from 'mono-svelte'
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
  <!-- <Popover openOnHover placement="bottom"> -->
  <div
    class="flex items-center text-sm rounded-md border border-slate-200
      dark:border-zinc-800 bg-white dark:bg-zinc-900 px-1 h-8 cursor-pointer"
    class:pr-2.5={$userSettings.separateVotes}
  >
    <div class="flex items-center">
      <Button
        aria-label="Upvote"
        class={vote == 1
          ? voteColor(vote)
          : 'hover:dark:text-blue-600 hover:text-blue-500'}
        on:click={async () => castVote(vote == 1 ? 0 : 1)}
        size="square-sm"
        color="tertiary"
        alignment="center"
      >
        <Icon src={ChevronUp} mini size="18" />
      </Button>
      <span
        class="font-medium transition-colors duration-200 grid {shouldShowVoteColor(
          vote,
          'upvotes'
        )}"
        class:hidden={$profile?.user?.local_user_view.local_user.show_scores ==
          false}
      >
        {#key $userSettings.separateVotes ? upvotes : score}
          <span
            in:fly={{ y: -4, duration: 200 }}
            out:fly={{ y: 4, duration: 200 }}
            style="grid-column: 1; grid-row: 1;"
          >
            <FormattedNumber
              number={$userSettings.separateVotes ? upvotes : score}
            />
          </span>
        {/key}
      </span>
    </div>
    {#if $userSettings.separateVotes}
      <div class="h-full py-1.5 pl-2 pr-0.5">
        <div class="border-l dark:border-zinc-700 h-full" />
      </div>
    {/if}
    <div class="flex items-center">
      <Button
        aria-label="Downvote"
        class="{vote == -1 ? voteColor(vote) : ''} {$site?.site_view.local_site
          .enable_downvotes
          ? 'hover:dark:text-red-600 hover:text-red-500'
          : 'pointer-events-none opacity-50'}"
        on:click={async () => castVote(vote == -1 ? 0 : -1)}
        size="square-sm"
        color="tertiary"
      >
        <Icon src={ChevronDown} mini size="18" />
      </Button>
      {#if $userSettings.separateVotes}
        <span
          class="font-medium transition-colors duration-200 grid {shouldShowVoteColor(
            vote,
            'downvotes'
          )}"
          class:hidden={$profile?.user?.local_user_view.local_user
            .show_scores == false}
        >
          {#key downvotes}
            <span
              in:fly={{ y: -4, duration: 200 }}
              out:fly={{ y: 4, duration: 200 }}
              style="grid-column: 1; grid-row: 1;"
            >
              <FormattedNumber number={downvotes} />
            </span>
          {/key}
        </span>
      {/if}
    </div>
  </div>
</slot>
