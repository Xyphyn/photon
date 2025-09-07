<script lang="ts" module>
  export const voteColor = (vote: number) =>
    vote == 1
      ? `bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900`
      : vote == -1
        ? `bg-red-500 text-slate-50 dark:bg-red-400 dark:text-zinc-900`
        : ''

  export const shouldShowVoteColor = (
    vote: number,
    type: 'upvotes' | 'downvotes',
  ): string =>
    (vote == -1 && type == 'downvotes') || (vote == 1 && type == 'upvotes')
      ? voteColor(vote)
      : ''
</script>

<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations'
  import { site } from '$lib/client/lemmy.svelte'
  import { vote as voteItem } from '$lib/lemmy/contentview.js'
  import { errorMessage } from '$lib/lemmy/error'
  import { settings } from '$lib/settings.svelte'
  import type { Post } from '$lib/client/types'
  import { buttonColor, toast } from 'mono-svelte'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  interface Props {
    post: Post
    vote?: number
    score: number
    upvotes: number
    downvotes: number
    showCounts?: boolean
    children?: import('svelte').Snippet<[{ vote?: number; score?: number }]>
  }

  let {
    post = $bindable(),
    vote = $bindable(),
    score = $bindable(),
    upvotes = $bindable(),
    downvotes = $bindable(),
    showCounts = true,
    children,
  }: Props = $props()

  const castVote = async (newVote: number) => {
    if (!profile.current?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }

    switch (vote ?? 0) {
      case 0:
        // nothing was removed
        if (newVote == 1) upvotes++
        else downvotes++
        break
      case 1:
        // removed an upvote
        upvotes--
        if (newVote == -1) downvotes++
        break
      case -1:
        // removed a downvote
        downvotes--
        if (newVote == 1) upvotes++
        break
    }

    vote = newVote

    voteItem(post, newVote)
      .then((res) => ({ upvotes, downvotes, score } = res))
      .catch((e) => {
        toast({ content: errorMessage(e), type: 'error' })
      })
  }
</script>

{#snippet voteButton(
  votes: number,
  target: 'upvote' | 'downvote',
  vote?: number,
)}
  {@const targetNum = target == 'upvote' ? 1 : -1}
  <button
    onclick={() => castVote(vote == targetNum ? 0 : targetNum)}
    class={[
      'flex items-center gap-0.5 transition-colors relative cursor-pointer h-full p-2',
      'first:rounded-l-3xl last:rounded-r-3xl',
      'last:flex-row-reverse',
      vote == targetNum
        ? shouldShowVoteColor(
            vote,
            target == 'upvote' ? 'upvotes' : 'downvotes',
          )
        : 'hover:bg-slate-100 dark:hover:bg-zinc-800',
    ]}
    aria-pressed={vote == targetNum}
    aria-label={$t(
      target == 'upvote'
        ? 'post.actions.vote.upvote'
        : 'post.actions.vote.downvote',
    )}
  >
    <Icon src={target == 'upvote' ? ChevronUp : ChevronDown} size="20" micro />
    {#if showCounts}
      <div class="grid text-sm z-20">
        {#key votes}
          <span
            style="grid-column: 1; grid-row: 1;"
            in:fly={{ duration: 400, y: -10, easing: backOut }}
            out:fly={{ duration: 400, y: 10, easing: backOut }}
            aria-label={$t(
              target == 'upvote' ? 'aria.vote.upvotes' : 'aria.vote.downvotes',
              { default: votes },
            )}
          >
            <FormattedNumber number={votes ?? 0} />
          </span>
        {/key}
      </div>
    {/if}
  </button>
{/snippet}

{#if children}{@render children({ vote, score })}{:else}
  {@const voteRatio = Math.floor(
    ((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0))) * 100,
  )}
  <div
    class={[
      buttonColor.secondary,
      'rounded-3xl h-full font-medium flex relative',
      voteRatio < 85 && settings.voteRatioBar && 'vote-ratio',
    ]}
    aria-label={$t('aria.vote.group')}
    style="--vote-ratio: {voteRatio}%;"
  >
    {@render voteButton(upvotes, 'upvote', vote)}
    <div
      class="h-full p-0! border-l border-slate-200 dark:border-zinc-800"
    ></div>
    {#if site.data?.site_view.local_site.enable_downvotes ?? true}
      {@render voteButton(downvotes, 'downvote', vote)}
    {/if}
  </div>
{/if}

<style>
  .vote-ratio {
    z-index: 0;
  }

  .vote-ratio::before {
    border-radius: var(--radius-3xl);
    content: '';
    position: absolute;
    height: 100%;
    opacity: 10%;
    width: 100%;
    left: 0;
    bottom: 0px;
    z-index: -10;
    background: linear-gradient(
      to right,
      var(--color-indigo-500) calc(var(--vote-ratio) - 4%),
      var(--color-red-500) calc(var(--vote-ratio) + 4%)
    );
  }
</style>
