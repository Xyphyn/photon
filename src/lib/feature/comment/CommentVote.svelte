<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { loader } from '$lib/app/util.svelte'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import { toast } from 'mono-svelte'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { shouldShowVoteColor } from '../post/PostVote.svelte'
  import type { CommentModel } from './comment.svelte'

  interface Props {
    comment: CommentModel
  }

  let { comment }: Props = $props()

  // These are redefined rather than directly taken from CommentModel
  // to allow for optimistic UI updates. $derived's can be overriden.
  let upvotes = $derived(comment.comment.upvotes)
  let downvotes = $derived(comment.comment.downvotes)
  let myVote = $derived(comment.myVote)
  let voteRatio = $derived(Math.floor(((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0))) * 100))

  async function castVote(newVote: 'upvoted' | 'downvoted' | 'none') {
    if (navigator.vibrate) navigator.vibrate(1)
    if (!profile.current?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }

    // post.myVote == current vote
    switch (comment.myVote) {
      case 'none':
        // nothing was removed
        if (newVote == 'upvoted') upvotes++
        else if (newVote == 'downvoted') downvotes++
        break
      case 'upvoted':
        upvotes--
        if (newVote == 'downvoted') downvotes++
        break
      case 'downvoted':
        downvotes--
        if (newVote == 'upvoted') upvotes++
        break
    }

    myVote = newVote
    loader(
      () => {},
      () => comment.vote(newVote),
    )
  }
</script>

{#snippet voteButton(votes: number, target: boolean, myVote?: boolean)}
  <button
    onclick={() => castVote(myVote == target ? 'none' : target === true ? 'upvoted' : 'downvoted')}
    class={[
      'flex items-center gap-0.5 transition-colors relative cursor-pointer px-1.5 py-1',
      'first:rounded-l-3xl last:rounded-r-3xl',
      'last:flex-row-reverse',
      myVote == target
        ? shouldShowVoteColor(myVote, target === true ? 'upvotes' : 'downvotes')
        : 'btn-tertiary',
    ]}
    aria-pressed={myVote == target}
    aria-label={$t(target === true ? 'post.actions.vote.upvote' : 'post.actions.vote.downvote')}
  >
    <Icon src={target === true ? ChevronUp : ChevronDown} size="18" micro />
    <div class="grid text-sm z-20">
      {#key votes}
        <span
          style="grid-column: 1; grid-row: 1;"
          in:fly={{ duration: 400, y: -10, easing: backOut }}
          out:fly={{ duration: 400, y: 10, easing: backOut }}
          aria-label={$t(target === true ? 'aria.vote.upvotes' : 'aria.vote.downvotes', {
            default: votes,
          })}
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
  {@render voteButton(
    upvotes,
    true,
    myVote == 'upvoted' ? true : myVote == 'downvoted' ? false : undefined,
  )}
  {#if site.data?.site_view.local_site.comment_downvotes ?? true}
    {@render voteButton(
      downvotes,
      false,
      myVote == 'upvoted' ? true : myVote == 'downvoted' ? false : undefined,
    )}
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
