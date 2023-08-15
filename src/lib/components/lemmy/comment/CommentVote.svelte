<script lang="ts">
  import { Color } from '$lib/ui/colors'
  import {
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { getClient } from '$lib/lemmy'
  import { userSettings } from '$lib/settings'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'

  export let vote: number = 0
  export let score: number
  export let commentId: number

  async function upvote() {
    if (!$profile?.jwt) return

    const upvoted = vote == 1

    if (vote == -1) {
      score += 2
    } else if (vote == 1) {
      score -= 1
    } else if (vote == 0) {
      score += 1
    }

    vote = Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : 1,
        auth: $profile.jwt,
        comment_id: commentId,
      })
      .catch((_) => undefined)
  }

  async function downvote() {
    if (!$profile?.jwt) return

    const upvoted = vote == -1

    if (vote == -1) {
      score += 1
    } else if (vote == 1) {
      score -= 2
    } else if (vote == 0) {
      score -= 1
    }

    vote = -Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : -1,
        auth: $profile.jwt,
        comment_id: commentId,
      })
      .catch((_) => undefined)
  }

  const voteColor = (vote: number) => `
  ${
    vote == 1
      ? $userSettings.revertColors
        ? '!text-orange-500'
        : '!text-blue-500'
      : vote == -1
      ? $userSettings.revertColors
        ? '!text-blue-500'
        : '!text-red-500'
      : ''
  }
  `
</script>

{#if $userSettings.newVote}
  <div
    class="flex flex-row items-center rounded-md transition-colors
  cursor-pointer h-[26px] gap-0.5 !text-slate-600 dark:!text-zinc-300"
  >
    <Button
      on:click={upvote}
      class={vote == 1
        ? voteColor(vote)
        : '!text-slate-600 dark:!text-zinc-300'}
      aria-label="Upvote"
      size="square-sm"
      color="tertiary"
    >
      <Icon src={ArrowUpCircle} width={19} mini={vote == 1} />
    </Button>
    <span class="text-sm font-medium {voteColor(vote)}">
      <FormattedNumber number={score} />
    </span>
    <Button
      on:click={downvote}
      class={vote == -1
        ? voteColor(vote)
        : '!text-slate-600 dark:!text-zinc-300'}
      aria-label="Downvote"
      size="square-sm"
      color="tertiary"
    >
      <Icon src={ArrowDownCircle} width={19} mini={vote == -1} />
    </Button>
  </div>
{:else}<div
    class="flex flex-row items-center rounded-md transition-colors
cursor-pointer h-[26px] border border-slate-200
dark:border-zinc-700"
  >
    <button
      on:click={upvote}
      class="px-1.5 {vote == 1
        ? $userSettings.revertColors
          ? 'text-orange-500'
          : 'dark:text-blue-500 text-blue-600'
        : ''}"
      aria-label="Upvote"
    >
      <Icon src={ChevronUp} width={19} mini />
    </button>
    <span class="text-sm font-medium {voteColor(vote)}">
      <FormattedNumber number={score} />
    </span>
    <button
      on:click={downvote}
      class="px-1.5 {vote == -1
        ? $userSettings.revertColors
          ? 'dark:text-blue-500 text-blue-600'
          : 'text-red-400'
        : ''}"
      aria-label="Downvote"
    >
      <Icon src={ChevronDown} width={19} mini />
    </button>
  </div>
{/if}
