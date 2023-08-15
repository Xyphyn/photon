<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { getClient } from '$lib/lemmy'
  import { userSettings } from '$lib/settings.js'
  import { Color } from '$lib/ui/colors.js'
  import type { Post } from 'lemmy-js-client'
  import {
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Icon,
  } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { slide } from 'svelte/transition'

  export let post: Post
  export let vote: number = 0
  export let score: number

  async function upvote() {
    if (!$profile?.jwt) return

    if (vote == undefined) vote = 0

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
      .likePost({
        score: upvoted ? 0 : 1,
        auth: $profile.jwt,
        post_id: post.id,
      })
      .catch((_) => undefined)
  }

  async function downvote() {
    if (!$profile?.jwt) return

    if (vote == undefined) vote = 0

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
      .likePost({
        score: upvoted ? 0 : -1,
        auth: $profile.jwt,
        post_id: post.id,
      })
      .catch((_) => undefined)
  }

  const voteColor = (vote: number) =>
    vote == 1
      ? $userSettings.revertColors
        ? '!text-orange-500'
        : '!text-blue-400'
      : vote == -1
      ? $userSettings.revertColors
        ? '!text-blue-500'
        : '!text-red-500'
      : ''
</script>

<slot {upvote} {downvote} {vote} {score}>
  <div class="flex items-center text-sm gap-1 rounded-md border-zinc-700">
    <Button
      aria-label="Upvote"
      class={vote == 1 ? voteColor(vote) : ''}
      on:click={upvote}
      size="square-md"
      color="tertiary"
      alignment="center"
    >
      <Icon src={ArrowUpCircle} mini={vote == 1} width={20} height={20} />
    </Button>
    <span class="font-medium {voteColor(vote)}">
      <FormattedNumber number={score} />
    </span>
    <Button
      aria-label="Downvote"
      class={vote == -1 ? voteColor(vote) : ''}
      on:click={downvote}
      size="square-md"
      color="tertiary"
    >
      <Icon src={ArrowDownCircle} mini={vote == -1} width={20} height={20} />
    </Button>
  </div>
</slot>
