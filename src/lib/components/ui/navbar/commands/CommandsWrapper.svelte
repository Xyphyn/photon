<script lang="ts">
  import { t } from '$lib/translations'
  import { Modal, Spinner } from 'mono-svelte'
  import Commands from './Commands.svelte'

  export let open: boolean = false

  function handleKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey && event.key === 'p') ||
      (event.key == '/' && document.activeElement == document.body)
    ) {
      event.preventDefault()
      open = !open
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <Modal title={$t('nav.commands.prompt')} bind:open>
    {#await import('./Commands.svelte')}
      <div class="h-96 flex flex-col gap-2 items-center justify-center">
        <Spinner width={32} />
        <span class="font-medium text-lg">Downloading actions...</span>
      </div>
    {:then { default: Commands }}
      <Commands bind:open />
    {/await}
  </Modal>
{/if}
