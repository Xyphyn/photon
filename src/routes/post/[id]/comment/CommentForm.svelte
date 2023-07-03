<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import { Color } from '$lib/ui/colors.js'
  import type { Comment, Post } from 'lemmy-js-client'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { createEventDispatcher } from 'svelte'

  export let postId: number
  export let parentId: number | undefined = undefined

  const dispatch = createEventDispatcher()

  let newComment = ''
  let loading = false

  async function submit() {
    if (!$user || !$authData || newComment == '') return

    loading = true

    try {
      const response = await getClient().createComment({
        auth: $authData.token,
        content: newComment,
        post_id: postId,
        parent_id: parentId,
      })
      dispatch('comment', response)

      newComment = ''
    } catch (err) {
      alert('Failed to comment')
    }

    loading = false
  }
</script>

<div class="max-w-lg flex flex-col gap-2">
  <textarea
    rows="3"
    class="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200
  dark:border-zinc-800 p-4 outline-none focus:border-black
  focus:dark:border-white transition-colors rounded-md"
    bind:value={newComment}
  />
  <div class="w-24 ml-auto">
    <Button
      large
      on:click={submit}
      color={Color.accent}
      {loading}
      disabled={loading}
    >
      Submit
    </Button>
  </div>
</div>
