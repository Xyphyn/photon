<script lang="ts" module>
  export const voteColor = (upvoted: boolean) =>
    upvoted === true
      ? `btn-primary border-0! border border-transparent`
      : upvoted === false
        ? `bg-red-500 text-slate-50 dark:bg-red-400 dark:text-zinc-900`
        : ''

  export const shouldShowVoteColor = (
    upvoted: boolean | undefined,
    type: 'upvotes' | 'downvotes',
  ): string =>
    (upvoted === false && type == 'downvotes') || (upvoted === true && type == 'upvotes')
      ? voteColor(upvoted)
      : ''
</script>

<script lang="ts">
  import { site } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import FormattedNumber from '$lib/ui/util/FormattedNumber.svelte'
  import { toast } from 'mono-svelte'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import type { PostModel } from './post.svelte'

  interface Props {
    post: PostModel
    showCounts?: boolean
  }

  let { post = $bindable(), showCounts = true }: Props = $props()

  // These are redefined rather than directly taken from PostModel
  // to allow for optimistic UI updates. $derived's can be overriden.
  let upvotes = $derived(post.post.upvotes)
  let downvotes = $derived(post.post.downvotes)
  let myVote = $derived(post.myVote)
  let voteRatio = $derived(Math.floor(((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0))) * 100))

  async function castVote(newVote: 'upvoted' | 'downvoted' | 'none') {
    if (navigator.vibrate) navigator.vibrate(1)
    if (!profile.current?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }

    // post.myVote == current vote
    switch (post.myVote) {
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
    post.vote(newVote).catch((e) => toast({ content: errorMessage(e), type: 'error' }))
  }
</script>

{#snippet voteButton(votes: number, target: boolean, myVote?: boolean)}
  <button
    onclick={() => castVote(myVote == target ? 'none' : target === true ? 'upvoted' : 'downvoted')}
    class={[
      'flex items-center gap-0.5 transition-colors relative cursor-pointer h-full p-2 first:border-r-0! first:rounded-l-[inherit] last:rounded-r-[inherit]',
      'last:flex-row-reverse',
      myVote === target
        ? shouldShowVoteColor(myVote, target === true ? 'upvotes' : 'downvotes')
        : 'btn-secondary',
    ]}
    aria-pressed={myVote === target}
    aria-label={$t(target === true ? 'post.actions.vote.upvote' : 'post.actions.vote.downvote')}
  >
    <Icon src={target === true ? ChevronUp : ChevronDown} size="20" micro />
    {#if showCounts}
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
    {/if}
  </button>
{/snippet}

<div
  class={[
    'rounded-xl h-full font-medium flex relative overflow-hidden',
    voteRatio < 85 && settings.voteRatioBar && 'vote-ratio',
  ]}
  aria-label={$t('aria.vote.group')}
  style="--vote-ratio: {voteRatio}%;"
>
  {@render voteButton(
    upvotes,
    true,
    myVote == 'upvoted' ? true : myVote == 'downvoted' ? false : undefined,
  )}
  {#if site.data?.site_view.local_site.post_downvotes != 'disable'}
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
    border-radius: inherit;
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
      var(--color-indigo-400) calc(var(--vote-ratio) - 2%),
      var(--color-red-400) calc(var(--vote-ratio) + 2%)
    );
  }
</style>
