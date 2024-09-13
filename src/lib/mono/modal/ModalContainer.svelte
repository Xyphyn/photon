<script lang="ts">
  import Button from '../button/Button.svelte'
  import Modal from '../modal/Modal.svelte'
  import { Icon } from 'svelte-hero-icons'
  import { shownModal } from './modal.js'

  let open = false

  // reactivity hack
  $: open = $shownModal ? true : false
</script>

{#if $shownModal}
  <Modal
    title={$shownModal.title}
    dismissable={$shownModal.dismissable}
    on:dismissed={() => shownModal.set(undefined)}
    bind:open
  >
    <p>{$shownModal.body}</p>
    {#if $shownModal.actions}
      <div
        class="flex items-center gap-2 {$shownModal.actions.length >= 3
          ? 'flex-col'
          : 'flex-row'}"
      >
        {#each $shownModal.actions as action}
          <Button
            size="lg"
            class="flex-1 w-full"
            on:click={action.action}
            color={action.type}
          >
            {#if action.icon}
              <Icon src={action.icon} mini size="16" slot="prefix" />
            {/if}
            {action.content}
          </Button>
        {/each}
      </div>
    {/if}
  </Modal>
{/if}
