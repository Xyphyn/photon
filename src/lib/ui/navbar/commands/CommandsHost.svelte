<script lang="ts" module>
  export let chords = $state({
    commands: false,
  })
</script>

<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Modal, TextLoader } from 'mono-svelte'

  function handleKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey && (event.key === 'k' || event.key == 'p')) ||
      (event.key == '/' && document.activeElement == document.body)
    ) {
      event.preventDefault()
      chords.commands = !chords.commands
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if chords.commands}
  <Modal bind:open={chords.commands} title={null} class="p-0! gap-0!">
    {#await import('./Commands.svelte')}
      <div class="h-128 flex flex-col gap-2 items-center justify-center">
        <TextLoader>
          {$t('nav.commands.downloading')}
        </TextLoader>
      </div>
    {:then { default: Commands }}
      <Commands bind:open={chords.commands} />
    {/await}
  </Modal>
{/if}
