<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { Button, TextInput, toast } from 'mono-svelte'

  interface Props {
    note?: string
    person: number
    onsubmit?: (note: string | null) => void
  }

  let { note: passedNote = '', person, onsubmit }: Props = $props()
  let note = $state(passedNote)

  // man wtf is this
  let loading = $state<boolean | null>(false)

  async function submit(note: string | null) {
    try {
      loading = note ? true : null
      if (!client().setNote) throw new Error('unsupported')

      await client().setNote!({ person_id: person, note: note })

      onsubmit?.(note)
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
    loading = false
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    submit(note)
  }}
  class="contents"
>
  <TextInput bind:value={note} label={$t('nav.commands.content')} required />
  <div class="flex flex-row gap-2 *:flex-1">
    <Button loading={loading === true} submit color="primary" size="lg">
      {$t('form.submit')}
    </Button>
    <Button
      onclick={() => submit(null)}
      loading={loading === null}
      color="danger"
      size="lg"
    >
      {$t('common.remove')}
    </Button>
  </div>
</form>
