<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked: boolean
  const dispatcher = createEventDispatcher<{ change: boolean }>()
</script>

<label class="flex flex-row items-center gap-2 cursor-pointer text-sm">
  <input
    type="checkbox"
    bind:checked
    on:change={() => dispatcher('change', !checked)}
  />
  <slot />
</label>
