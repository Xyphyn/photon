<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import type { Post } from 'lemmy-js-client'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { Button } from 'mono-svelte'
  import { site } from '$lib/lemmy.js'

  export let post: Post
  export let vote: number = 0
  export let score: number

  const voteColor = (vote: number, border: boolean = false) =>
    vote == 1 ? `!text-blue-500` : vote == -1 ? `!text-red-500` : ''
</script>

<slot {vote} {score}>
  <div
    class=" flex items-center text-sm gap-1 rounded-md border border-slate-200
      dark:border-zinc-800 bg-white dark:bg-zinc-900 px-1 h-8 cursor-pointer"
  >
    <Button
      aria-label="Upvote"
      class={vote == 1 ? voteColor(vote) : ''}
      on:click={async () => {
        if (!$profile?.jwt) return
        vote = vote == 1 ? 0 : 1
        score = await voteItem(post, vote, $profile.jwt)
      }}
      size="square-sm"
      color="tertiary"
      alignment="center"
    >
      <Icon src={ChevronUp} mini size="18" />
    </Button>
    <span
      class="font-medium transition-colors duration-200 {voteColor(vote)}"
      class:hidden={$profile?.user?.local_user_view.local_user.show_scores ==
        false}
    >
      <FormattedNumber number={score} />
    </span>
    <Button
      aria-label="Downvote"
      class="{vote == -1 ? voteColor(vote) : ''} {$site?.site_view.local_site
        .enable_downvotes
        ? ''
        : 'pointer-events-none opacity-50'}"
      on:click={async () => {
        if (!$profile?.jwt) return
        vote = vote == -1 ? 0 : -1
        score = await voteItem(post, vote, $profile.jwt)
      }}
      size="square-sm"
      color="tertiary"
    >
      <Icon src={ChevronDown} mini size="18" />
    </Button>
  </div>
</slot>
