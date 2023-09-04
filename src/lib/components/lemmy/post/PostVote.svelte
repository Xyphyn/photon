<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Post } from 'lemmy-js-client'
  import {
    ArrowDown,
    ArrowDownCircle,
    ArrowUp,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { Button, Popover } from 'mono-svelte'

  export let post: Post
  export let vote: number = 0
  export let upvotes: number = 0
  export let downvotes: number = 0
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
    <Popover targetClass="h-8 z-30" openOnHover>
      <div
        class="flex items-center text-sm gap-1 rounded-md border border-slate-200
    dark:border-zinc-700 px-1 h-8 duration-200 dark:bg-zinc-900"
        slot="target"
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
      <div class="flex flex-row items-center gap-2">
        <span class="flex items-center gap-1 text-blue-500 font-medium">
          <Icon src={ArrowUp} mini size="18" />
          <FormattedNumber number={upvotes} />
        </span>
        <span class="flex items-center gap-1 text-red-500 font-medium">
          <Icon src={ArrowDown} mini size="18" />
          <FormattedNumber number={downvotes} />
        </span>
      </div>
    </Popover>
  {/if}
</slot>
