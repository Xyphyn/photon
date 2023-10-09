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

  export let post: Post
  export let vote: number = 0
  export let score: number
  export let upvotes: number = 0
  export let downvotes: number = 0

  let oldScore = score

  const voteColor = (vote: number, border: boolean = false) =>
    vote == 1 ? `!text-blue-500` : vote == -1 ? `!text-red-500` : ''

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
  <Popover openOnHover placement="bottom">
    <div
      class=" flex items-center text-sm gap-1 rounded-md border border-slate-200
      dark:border-zinc-800 bg-white dark:bg-zinc-900 px-1 h-8 cursor-pointer"
      slot="target"
    >
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
        class="font-medium transition-colors duration-200 grid {voteColor(
          vote
        )}"
        class:hidden={$profile?.user?.local_user_view.local_user.show_scores ==
          false}
      >
        {#key score}
          <span
            in:fly={{ y: score > oldScore ? 4 : -4, duration: 200 }}
            out:fly={{ y: score > oldScore ? -4 : 4, duration: 200 }}
            style="grid-column: 1; grid-row: 1;"
          >
            <FormattedNumber number={score} />
          </span>
        {/key}
      </span>
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
    </div>
    <div class="flex items-center gap-2">
      <div class="flex items-center font-medium text-blue-500 gap-0.5">
        <Icon src={ArrowUp} mini size="18" title="Upvotes" />
        {upvotes}
      </div>
      <div class="flex items-center font-medium text-red-500 gap-0.5">
        <Icon src={ArrowDown} mini size="18" title="Downvotes" />
        {downvotes}
      </div>
    </div>
  </Popover>
</slot>
