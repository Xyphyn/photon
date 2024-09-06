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
  import { t } from '$lib/translations'
  import { errorMessage } from '$lib/lemmy/error'

  export let postId: number
  export let parentId: number | undefined = undefined
  export let locked: boolean = false
  export let banned: boolean = false
  export let rows: number = 7
  export let placeholder: string | undefined = undefined

  const dispatch = createEventDispatcher<{
    comment: CommentResponse
    confirm: string
    cancel: boolean
  }>()

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
    } catch (err) {
      console.error(err)
      toast({
        content: errorMessage(err as any),
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
      {...$$restProps}
      {rows}
      placeholder={locked
        ? $t('comment.locked')
        : banned
          ? $t('comment.banned')
          : (placeholder ?? placeholders.get('comment'))}
      bind:value
      disabled={locked || loading || banned}
      on:confirm={() => {
        if (actions) {
          submit()
          dispatch('confirm', value)
        }
      }}
      on:focus
      previewButton={previewAction}
    >
      <div class="flex-1" />
      {#if actions}
        <Button
          on:click={() => dispatch('cancel', true)}
          color="tertiary"
          size="lg"
          class=" w-28"
        >
          {$t('common.cancel')}
        </Button>
        <Button
          on:click={submit}
          color="primary"
          size="lg"
          class=" w-28"
          {loading}
          disabled={locked || loading || banned}
        >
          {$t('form.submit')}
        </Button>
      {/if}
    </MarkdownEditor>
  {/if}
</div>
