<script lang="ts">
  import { Color } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'

  type ButtonColor = keyof typeof buttonColors

  const buttonColors = {
    secondary:
      'hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white fill-black dark:fill-white',
    dangerSecondary: 'hover:bg-red-500 text-red-500 hover:text-white',
    success: 'hover:bg-green-600 text-green-500 hover:text-white',
  }

  export let color: ButtonColor = 'secondary'
  export let link = false
  export let href = ''

  const click = createEventDispatcher()
</script>

<li>
  {#if link}
    <a
      {href}
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm transition-colors {buttonColors[
        color
      ]}"
    >
      <slot />
    </a>
  {:else}
    <button
      on:click={(e) => click('click', e)}
      type="button"
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm transition-colors {buttonColors[
        color
      ]}"
    >
      <slot />
    </button>
  {/if}
</li>
