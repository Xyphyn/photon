<script lang="ts">
  import Modal from '$lib/components/ui/modal/Modal.svelte'
  import DebugTree from '$lib/components/util/debug/DebugTree.svelte'

  export let object: any
  export let open: boolean = false
</script>

<Modal bind:open>
  <span slot="title">Debug</span>
  <DebugTree {object} isParent={true} />
</Modal>
