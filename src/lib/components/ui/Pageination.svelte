<script lang="ts">
  import { Button } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'

  export let page: number

  const dispatcher = createEventDispatcher<{ change: number }>()
</script>

<div class="flex flex-row w-full gap-4">
  <Button
    on:click={() => {
      dispatcher('change', --page)
    }}
    disabled={page <= 1}
    class="flex-1"
  >
    Back
  </Button>

  <Button
    on:click={() => {
      dispatcher('change', ++page)
    }}
    class="flex-1"
  >
    Next
  </Button>
</div>
