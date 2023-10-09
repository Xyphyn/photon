<script lang="ts">
  import { Color } from '$lib/ui/colors'
  import {
    ArrowDownCircle,
    ArrowUp,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { getClient, site } from '$lib/lemmy'
  import { userSettings } from '$lib/settings'
  import { profile } from '$lib/auth.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button } from 'mono-svelte'

  export let vote: number = 0
  export let score: number
  export let commentId: number

  async function upvote() {
    if (!$profile?.jwt) return

    const upvoted = vote == 1

    if (vote == -1) {
      score += 2
    } else if (vote == 1) {
      score -= 1
    } else if (vote == 0) {
      score += 1
    }

    vote = Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : 1,
        comment_id: commentId,
      })
      .catch((_) => undefined)
  }

  async function downvote() {
    if (!$profile?.jwt) return

    const upvoted = vote == -1

    if (vote == -1) {
      score += 1
    } else if (vote == 1) {
      score -= 2
    } else if (vote == 0) {
      score -= 1
    }

    vote = -Number(!upvoted)

    await getClient()
      .likeComment({
        score: upvoted ? 0 : -1,
        comment_id: commentId,
      })
      .catch((_) => undefined)
  }

  const voteColor = (vote: number) => `
  ${vote == 1 ? '!text-blue-500' : vote == -1 ? '!text-red-500' : ''}
  `
</script>

<div
  class="flex flex-row items-center rounded-md transition-all
cursor-pointer h-full border-slate-200
dark:border-zinc-800 gap-0.5"
>
  <Button
    on:click={upvote}
    class=" transition-colors {vote == 1
      ? 'dark:text-blue-500 text-blue-600'
      : 'hover:dark:text-blue-500 hover:text-blue-600'}"
    aria-label="Upvote"
    size="custom"
    color="tertiary"
  >
    <Icon src={ChevronUp} size="20" mini />
  </Button>
  <span
    class="text-sm font-medium transition-colors {voteColor(vote)}"
    class:hidden={$profile?.user?.local_user_view.local_user.show_scores ==
      false}
  >
    <FormattedNumber number={score} />
  </span>
  <Button
    on:click={downvote}
    class="{vote == -1
      ? 'text-red-400'
      : 'hover:dark:text-red-500 hover:text-red-600'} transition-colors disabled:pointer-events-none disabled:opacity-50"
    aria-label="Downvote"
    disabled={$site?.site_view.local_site.enable_downvotes == false}
    size="custom"
    color="tertiary"
  >
    <Icon src={ChevronDown} size="20" mini />
  </Button>
</div>
