<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import { Color } from '$lib/ui/colors.js'
  import type { CommentResponse } from 'lemmy-js-client'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { createEventDispatcher } from 'svelte'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'
  import TextArea from '$lib/components/input/TextArea.svelte'

  export let postId: number
  export let parentId: number | undefined = undefined
  export let locked: boolean = false

  const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

  export let value = ''
  export let actions = true

  let loading = false

  async function submit() {
    if (!$user || !$authData || value == '') return

    loading = true

    try {
      const response = await getClient().createComment({
        auth: $authData.token,
        content: value,
        post_id: postId,
        parent_id: parentId,
      })
      dispatch('comment', response)

      value = ''
      addToast(
        'Success',
        'Your comment was added. You may need to refresh to see it.',
        ToastType.success
      )
    } catch (err) {
      console.error(err)
      addToast(
        'Error',
        'Failed to comment. (Sometimes this error appears even when successful.)',
        ToastType.error
      )
    }

    loading = false
  }
</script>

<div class="flex flex-col gap-2 relative">
  <TextArea
    rows={4}
    placeholder={locked ? 'This post is locked.' : 'What are you thinking?'}
    class="!bg-slate-100 dark:!bg-zinc-900"
    bind:value
    disabled={locked}
  />
  {#if actions}
    <div class="sm:ml-auto sm:w-28">
      <Button
        large
        on:click={submit}
        color="primary"
        size="lg"
        class="w-full"
        {loading}
        disabled={locked || loading}
      >
        Submit
      </Button>
    </div>
  {/if}
</div>
