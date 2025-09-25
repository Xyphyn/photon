<script lang="ts">
  import { Button, Modal } from 'mono-svelte'
  import { Icon } from 'svelte-hero-icons/dist'
  import { shownModal } from './modal'
</script>

{#if $shownModal}
  <Modal
    title={$shownModal.title}
    dismissable={$shownModal.dismissable}
    ondismissed={() => shownModal.set(undefined)}
    bind:open={$shownModal}
  >
    {#if $shownModal.snippet}
      {@render $shownModal.snippet()}
    {/if}
    {#if $shownModal.body}
      <p>{$shownModal.body}</p>
    {/if}
    {#if $shownModal.actions}
      <div
        class="flex items-center gap-2 {$shownModal.actions.length >= 3
          ? 'flex-col'
          : 'flex-row'}"
      >
        {#each $shownModal.actions as action (action)}
          <Button
            size="lg"
            class="flex-1 w-full"
            onclick={action.action}
            color={action.type}
          >
            {#if action.icon}
              <Icon src={action.icon} mini size="16" />
            {/if}
            {action.content}
          </Button>
        {/each}
      </div>
    {/if}
  </Modal>
{/if}
