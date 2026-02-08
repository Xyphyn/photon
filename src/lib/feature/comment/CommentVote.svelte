<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import type { Comment } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import { toast } from 'mono-svelte'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { vote as voteItem } from '../legacy/contentview'
  import { shouldShowVoteColor } from '../post/PostVote.svelte'

  interface Props {
    vote?: number
    upvotes: number
    downvotes: number
    comment: Comment
  }

  let {
    vote = $bindable(0),
    upvotes = $bindable(),
    downvotes = $bindable(),
    comment,
  }: Props = $props()

  const castVote = async (newVote: number) => {
    if (navigator.vibrate) navigator.vibrate(1)
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

    voteItem(comment, newVote)
      .then((res) => ({ upvotes, downvotes } = res))
      .catch((e) => {
        toast({ content: errorMessage(e), type: 'error' })
      })
  }

  let voteRatio = $derived(
    Math.floor(((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0))) * 100),
  )
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
      'flex items-center gap-0.5 transition-colors relative cursor-pointer px-1.5 py-1',
      'first:rounded-l-3xl last:rounded-r-3xl',
      'last:flex-row-reverse',
      vote == targetNum
        ? shouldShowVoteColor(
            vote,
            target == 'upvote' ? 'upvotes' : 'downvotes',
          )
        : 'btn-tertiary',
    ]}
    aria-pressed={vote == targetNum}
    aria-label={$t(
      target == 'upvote'
        ? 'post.actions.vote.upvote'
        : 'post.actions.vote.downvote',
    )}
  >
    <Icon src={target == 'upvote' ? ChevronUp : ChevronDown} size="18" micro />
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
  </button>
{/snippet}

<div
  class={[
    'h-full relative flex items-center overflow-hidden rounded-full font-medium',
    voteRatio < 85 && settings.voteRatioBar && 'vote-ratio',
    'divide-x divide-slate-200 dark:divide-zinc-800 border border-slate-200 dark:border-zinc-800',
  ]}
  style="--vote-ratio: {voteRatio}%;"
>
  {@render voteButton(upvotes, 'upvote', vote)}
  {#if site.data?.site_view.local_site.enable_downvotes ?? true}
    {@render voteButton(downvotes, 'downvote', vote)}
  {/if}
</div>

<style>
  .vote-ratio {
    z-index: 0;
  }

  .vote-ratio::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 10%;
    z-index: -10;
    left: 0;
    bottom: 0px;
    background: linear-gradient(
      to right,
      var(--color-indigo-500) calc(var(--vote-ratio) - 5%),
      var(--color-red-500) calc(var(--vote-ratio) + 5%)
    );
  }
</style>
