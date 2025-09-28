<script lang="ts">
  import { Modal } from 'mono-svelte'
  import DebugTree from './DebugTree.svelte'

  interface Props {
    object: any
    open?: boolean
    title?: import('svelte').Snippet
  }

  let { object, open = $bindable(false), title }: Props = $props()
</script>

<Modal bind:open>
  {#snippet customTitle()}
    <span>
      {#if title}{@render title()}{:else}Debug{/if}
    </span>
  {/snippet}
  <DebugTree {object} isParent={true} />
</Modal>
