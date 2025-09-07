<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { buttonColor, toast } from 'mono-svelte'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { shouldShowVoteColor } from '../post/PostVote.svelte'
  import { settings } from '$lib/settings.svelte'

  interface Props {
    vote?: number
    upvotes: number
    downvotes: number
    commentId: number
  }

  let {
    vote = $bindable(0),
    upvotes = $bindable(),
    downvotes = $bindable(),
    commentId,
  }: Props = $props()

  const castVote = async (newVote: number) => {
    if (!profile.current?.jwt) {
      toast({ content: $t('toast.loginVoteGate'), type: 'warning' })
      return
    }

    vote = newVote
    const res = await getClient().likeComment({
      comment_id: commentId,
      score: vote,
    })
    ;({ upvotes, downvotes } = res.comment_view.counts)
  }

  let voteRatio = $derived(
    Math.floor(((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0))) * 100),
  )
</script>

<div
  class={[
    'h-full relative flex items-center overflow-hidden rounded-full hover:bg-transparent font-medium hover:dark:bg-transparent',
    buttonColor.ghost,
    voteRatio < 85 && settings.voteRatioBar && 'vote-ratio',
  ]}
  style="--vote-ratio: {voteRatio}%;"
>
  <button
    onclick={() => castVote(vote == 1 ? 0 : 1)}
    class={[
      'flex items-center gap-0.5 transition-colors px-1.5 h-full cursor-pointer',
      vote == 1
        ? shouldShowVoteColor(vote, 'upvotes')
        : 'hover:bg-slate-100 dark:hover:bg-zinc-800',
    ]}
  >
    <Icon src={ChevronUp} size="18" mini />
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
  <div
    class="border-l h-full w-0 p-0! border-slate-200 dark:border-zinc-800"
  ></div>
  <button
    onclick={() => castVote(vote == -1 ? 0 : -1)}
    class={[
      'flex flex-row-reverse items-center gap-0.5 transition-colors px-1.5 h-full cursor-pointer',
      vote == -1
        ? shouldShowVoteColor(vote, 'downvotes')
        : 'hover:bg-slate-100 dark:hover:bg-zinc-800',
    ]}
  >
    <Icon src={ChevronDown} size="18" mini />
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
