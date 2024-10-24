<script lang="ts">
  import { hexToRgb } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'

  export let value: string

  const dispatch = createEventDispatcher<{ change: string }>()

  let clazz: string = ''
  export { clazz as class }
</script>

<div
  class="w-full h-8 relative rounded-md border dark:border-zinc-600 hover:dark:border-zinc-400
  transition-colors {clazz}"
  style="background-color: rgb({value});"
>
  <input
    class="rounded-md border cursor-pointer absolute top-0 left-0 w-full h-full opacity-0"
    type="color"
    bind:value
    on:change={() => dispatch('change', hexToRgb(value))}
    on:contextmenu
  />
</div>
