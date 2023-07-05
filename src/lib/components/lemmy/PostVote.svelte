<script lang="ts">
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { authData, getClient } from '$lib/lemmy'
  import type { Post } from 'lemmy-js-client'
  import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons'

  export let post: Post
  export let vote: number | undefined
  export let score: number

  async function upvote() {
    if (!$authData) return

    const upvoted = vote == 1

    await getClient()
      .likePost({
        score: upvoted ? 0 : 1,
        auth: $authData.token,
        post_id: post.id,
      })
      .catch((_) => undefined)
  }

  async function downvote() {
    if (!$authData) return

    const upvoted = vote == -1

    await getClient()
      .likePost({
        score: upvoted ? 0 : -1,
        auth: $authData.token,
        post_id: post.id,
      })
      .catch((_) => undefined)
  }
</script>

<div
  class="flex flex-row items-center gap-1 rounded-md transition-colors
  cursor-pointer border border-slate-200 dark:border-zinc-800
            {// upvote
  vote == 1
    ? 'bg-orange-600/20 text-orange-500'
    : // downvote
    vote == -1
    ? 'bg-blue-600/40 text-blue-400'
    : // no vote
      'bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-700'}"
>
  <button
    aria-label="Upvote"
    class="p-1 px-1.5"
    on:click={() => {
      vote = vote == 1 ? 0 : 1
      upvote()
    }}
  >
    <Icon src={ChevronUp} mini width={20} height={20} />
  </button>
  <span class="text-sm">
    <FormattedNumber number={score} />
  </span>
  <button
    aria-label="Downvote"
    class="p-1 px-1.5"
    on:click={() => {
      vote = vote == -1 ? 0 : -1
      downvote()
    }}
  >
    <Icon src={ChevronDown} mini width={20} height={20} />
  </button>
</div>
