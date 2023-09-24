<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import type { Post } from 'lemmy-js-client'
  import { ChevronDown, ChevronUp, Icon, Key } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { Button, toast } from 'mono-svelte'
  import { site } from '$lib/lemmy.js'
  import { fly } from 'svelte/transition'

  export let post: Post
  export let vote: number = 0
  export let score: number

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
    score = await voteItem(post, newVote, $profile.jwt)
  }
</script>

<slot {vote} {score}>
  <div
    class=" flex items-center text-sm gap-1 rounded-md border border-slate-200
      dark:border-zinc-800 bg-white dark:bg-zinc-900 px-1 h-8 cursor-pointer"
  >
    <Button
      aria-label="Upvote"
      class={vote == 1 ? voteColor(vote) : ''}
      on:click={async () => castVote(vote == 1 ? 0 : 1)}
      size="square-sm"
      color="tertiary"
      alignment="center"
    >
      <Icon src={ChevronUp} mini size="18" />
    </Button>
    <span
      class="font-medium transition-colors duration-200 grid {voteColor(vote)}"
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
        ? ''
        : 'pointer-events-none opacity-50'}"
      on:click={async () => castVote(vote == -1 ? 0 : -1)}
      size="square-sm"
      color="tertiary"
    >
      <Icon src={ChevronDown} mini size="18" />
    </Button>
  </div>
</slot>
