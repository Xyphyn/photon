<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { getClient } from '$lib/lemmy'
  import { userSettings } from '$lib/settings.js'
  import { Color } from '$lib/ui/colors.js'
  import type { Post } from 'lemmy-js-client'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'
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
</script>

<slot {upvote} {downvote} {vote} {score}>
  <div
    class="{Color.border} text-sm gap-0.5 rounded-md flex flex-row items-center
    transition-colors cursor-pointer bg-slate-100 dark:bg-zinc-800
    hover:bg-slate-200 dark:hover:bg-zinc-700"
  >
    <button
      aria-label="Upvote"
      class:text-orange-500={vote == 1 && $userSettings.revertColors}
      class:text-blue-500={vote == 1 && !$userSettings.revertColors}
      class="py-1 pr-0.5 pl-2"
      on:click={upvote}
    >
      <Icon src={ChevronUp} mini width={20} height={20} />
    </button>
    <FormattedNumber number={score} />
    <button
      aria-label="Downvote"
      class:text-blue-500={vote == -1 && $userSettings.revertColors}
      class:text-red-500={vote == -1 && !$userSettings.revertColors}
      class="py-1 pl-0.5 pr-2"
      on:click={downvote}
    >
      <Icon src={ChevronDown} mini width={20} height={20} />
    </button>
  </div>
</slot>
