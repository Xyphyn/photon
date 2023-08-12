<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let defaultValue: boolean = false
  export let checked: boolean | undefined = defaultValue
  const dispatcher = createEventDispatcher<{ change: boolean }>()
</script>

<label class="flex flex-row gap-2 cursor-pointer text-sm">
  <input
    type="checkbox"
    bind:checked
    on:change={() => dispatcher('change', !checked)}
  />
  <slot />
</label>
