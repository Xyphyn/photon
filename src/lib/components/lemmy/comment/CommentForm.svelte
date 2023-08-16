<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import { Color } from '$lib/ui/colors.js'
  import type { CommentResponse } from 'lemmy-js-client'
  import { getClient } from '$lib/lemmy.js'
  import { createEventDispatcher } from 'svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { profile } from '$lib/auth.js'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { placeholders } from '$lib/util.js'

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
        auth: $profile.jwt,
        content: value,
        post_id: postId,
        parent_id: parentId,
      })
      dispatch('comment', response)

      value = ''
      toast({
        content: 'Your comment was added. You may need to refresh to see it.',
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
  <MarkdownEditor
    rows={7}
    placeholder={locked ? 'This post is locked.' : placeholders.get('comment')}
    bind:value
    disabled={locked || loading}
    on:confirm={submit}
    previewButton
  />
</div>
