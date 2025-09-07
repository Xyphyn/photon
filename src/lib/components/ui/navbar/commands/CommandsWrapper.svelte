<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { Modal, TextLoader } from 'mono-svelte'

  interface Props {
    open?: boolean
  }

  let { open = $bindable(false) }: Props = $props()

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

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <Modal bind:open title={null} class="p-0! gap-0!">
    {#await import('./Commands.svelte')}
      <div class="h-128 flex flex-col gap-2 items-center justify-center">
        <TextLoader>
          {$t('nav.commands.downloading')}
        </TextLoader>
      </div>
    {:then { default: Commands }}
      <Commands bind:open />
    {/await}
  </Modal>
{/if}
