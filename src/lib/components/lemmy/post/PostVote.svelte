<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { getClient } from '$lib/lemmy'
  import { userSettings } from '$lib/settings.js'
  import { Color } from '$lib/ui/colors.js'
  import type { Post } from 'lemmy-js-client'
  import {
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'

  export let post: Post
  export let vote: number = 0
  export let score: number

  const voteColor = (vote: number) =>
    vote == 1
      ? $userSettings.revertColors
        ? '!text-orange-500'
        : '!text-blue-500 dark:!text-blue-400'
      : vote == -1
      ? $userSettings.revertColors
        ? '!text-blue-500'
        : '!text-red-500'
      : ''
</script>

<slot {vote} {score}>
  {#if $userSettings.newVote}
    <div class="flex items-center text-sm rounded-md border-zinc-800">
      <Button
        aria-label="Upvote"
        class={vote == 1 ? voteColor(vote) : ''}
        on:click={async () => {
          if (!$profile?.jwt) return
          score = await voteItem(post, vote == 1 ? 0 : 1, $profile.jwt)
          vote = vote == 1 ? 0 : 1
        }}
        size="square-md"
        color="tertiary"
        alignment="center"
      >
        <Icon src={ArrowUpCircle} mini={vote == 1} size="20" />
      </Button>
      <span class="font-medium {voteColor(vote)}">
        <FormattedNumber number={score} />
      </span>
      <Button
        aria-label="Downvote"
        class={vote == -1 ? voteColor(vote) : ''}
        on:click={async () => {
          if (!$profile?.jwt) return
          score = await voteItem(post, vote == -1 ? 0 : -1, $profile.jwt)
          vote = vote == -1 ? 0 : -1
        }}
        size="square-md"
        color="tertiary"
      >
        <Icon src={ArrowDownCircle} mini={vote == -1} size="20" />
      </Button>
    </div>
  {:else}
    <div
      class="flex items-center text-sm gap-1 rounded-md border border-slate-200
    dark:border-zinc-700 px-1 h-full duration-200 dark:bg-zinc-900"
    >
      <Button
        aria-label="Upvote"
        class={vote == 1 ? voteColor(vote) : ''}
        on:click={async () => {
          if (!$profile?.jwt) return
          score = await voteItem(post, vote == 1 ? 0 : 1, $profile.jwt)
          vote = vote == 1 ? 0 : 1
        }}
        size="square-sm"
        color="tertiary"
        alignment="center"
      >
        <Icon src={ChevronUp} mini size="18" />
      </Button>
      <span
        class="font-medium transition-colors duration-200 {voteColor(vote)}"
      >
        <FormattedNumber number={score} />
      </span>
      <Button
        aria-label="Downvote"
        class={vote == -1 ? voteColor(vote) : ''}
        on:click={async () => {
          if (!$profile?.jwt) return
          score = await voteItem(post, vote == -1 ? 0 : -1, $profile.jwt)
          vote = vote == -1 ? 0 : -1
        }}
        size="square-sm"
        color="tertiary"
      >
        <Icon src={ChevronDown} mini size="18" />
      </Button>
    </div>
  {/if}
</slot>
