<script lang="ts" context="module">
  import { userSettings } from '$lib/settings.js'
  export const voteColor = (vote: number, border: boolean = false) =>
    vote == 1
      ? `bg-blue-500 dark:bg-blue-400 text-slate-50 dark:text-zinc-900`
      : vote == -1
        ? `bg-red-500 text-slate-50 dark:bg-red-400 dark:text-zinc-900`
        : ''

  export const shouldShowVoteColor = (
    vote: number,
    type: 'upvotes' | 'downvotes'
  ): string =>
    (vote == -1 && type == 'downvotes') || (vote == 1 && type == 'upvotes')
      ? voteColor(vote)
      : ''
</script>

<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import type { Post } from 'lemmy-js-client'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { Button, Popover, buttonColor, toast } from 'mono-svelte'
  import { site } from '$lib/lemmy.js'
  import { fly } from 'svelte/transition'
  import { backOut } from 'svelte/easing'
  import { t } from '$lib/translations'
  import { errorMessage } from '$lib/lemmy/error'

  export let post: Post
  export let vote: number = 0
  export let score: number
  export let upvotes: number = 0
  export let downvotes: number = 0

  let loading = false

  let oldScore = score

  const castVote = async (newVote: number) => {
    if (!$profile?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }
    loading = true
    oldScore = score
    vote = newVote
    const res = await voteItem(post, newVote, $profile.jwt).catch((e) => {
      toast({ content: errorMessage(e), type: 'error' })
      return { upvotes: 0, downvotes: 0, score: 0 }
    })
    ;({ upvotes, downvotes, score } = res)
    loading = false
  }
</script>

<slot {vote} {score}>
  <div
    class="{buttonColor.ghost} rounded-full h-full font-medium flex items-center *:p-2
    hover:bg-white hover:dark:bg-zinc-900 overflow-hidden transition-colors flex-shrink-0
    {vote != 0
      ? ''
      : '!text-inherit'} !text-inherit divide-x divide-slate-200 dark:divide-zinc-800
    {loading ? 'animate-pulse opacity-75 pointer-events-none' : ''}"
  >
    <button
      on:click={() => castVote(vote == 1 ? 0 : 1)}
      class="flex items-center gap-0.5 transition-colors
      {vote == 1
        ? shouldShowVoteColor(vote, 'upvotes')
        : 'hover:bg-slate-100 hover:dark:bg-zinc-800'}"
    >
      <Icon src={ChevronUp} size="20" micro />
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
    {#if $site?.site_view.local_site.enable_downvotes ?? true}
      <button
        on:click={() => castVote(vote == -1 ? 0 : -1)}
        class="flex items-center flex-row-reverse gap-0.5 transition-colors
      {vote == -1
          ? shouldShowVoteColor(vote, 'downvotes')
          : 'hover:bg-slate-100 hover:dark:bg-zinc-800'}"
      >
        <Icon src={ChevronDown} size="20" micro />
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
    {/if}
  </div>
</slot>
