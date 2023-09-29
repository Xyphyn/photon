<script lang="ts">
  import type { CommentResponse } from 'lemmy-js-client'
  import { getClient } from '$lib/lemmy.js'
  import { createEventDispatcher } from 'svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { profile } from '$lib/auth.js'
  import { toast } from 'mono-svelte'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { placeholders } from '$lib/util.js'
  import { Button } from 'mono-svelte'

  export let postId: number
  export let parentId: number | undefined = undefined
  export let locked: boolean = false

  const dispatch = createEventDispatcher<{ comment: CommentResponse }>()

  export let value = ''
  export let actions = true

  let previewAction = true
  export { previewAction as preview }

  let loading = false
  let preview = false

  async function submit() {
    if (!$profile?.user || !$profile?.jwt || value == '') return

    loading = true

    try {
      const response = await getClient().createComment({
        content: value,
        post_id: postId,
        parent_id: parentId,
      })
      dispatch('comment', response)

      value = ''
      toast({
        content: 'Your comment was submitted.',
        type: 'success',
      })
    } catch (err) {
      console.error(err)
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }
</script>

<div class="flex flex-col gap-2 relative">
  {#if preview}
    <div
      class="bg-slate-100 dark:bg-zinc-900 px-3 py-2.5 h-64 border
      border-slate-300 dark:border-zinc-700 rounded-md overflow-auto text-sm resize-y"
    >
      <Markdown source={value} />
    </div>
  {:else}
    <MarkdownEditor
      rows={7}
      placeholder={locked
        ? 'This post is locked.'
        : placeholders.get('comment')}
      bind:value
      disabled={locked || loading}
      on:confirm={submit}
      previewButton={previewAction}
    >
      {#if actions}
        <div class="ml-auto">
          <Button
            large
            on:click={submit}
            color="primary"
            size="lg"
            class="sm:ml-auto w-28"
            {loading}
            disabled={locked || loading}
          >
            Submit
          </Button>
        </div>
      {/if}
    </MarkdownEditor>
  {/if}
</div>
