<script lang="ts">
  import { Color } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'

  export let color: Color = Color.secondary
  export let link = false
  export let href = ''

  const click = createEventDispatcher()
</script>

<li>
  {#if link}
    <a
      {href}
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm transition-colors {color}"
    >
      <slot />
    </a>
  {:else}
    <button
      on:click={(e) => click('click', e)}
      type="button"
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm transition-colors {color}"
    >
      <slot />
    </button>
  {/if}
</li>
