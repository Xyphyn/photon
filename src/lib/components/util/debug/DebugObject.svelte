<script lang="ts">
  import DebugTree from '$lib/components/util/debug/DebugTree.svelte'
  import { Modal } from 'mono-svelte'

  export let object: any
  export let open: boolean = false
</script>

<Modal bind:open>
  <span slot="title"><slot name="title">Debug</slot></span>
  <DebugTree {object} isParent={true} />
</Modal>
