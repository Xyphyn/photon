<script lang="ts">
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { Color } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'

  type ButtonColor = keyof typeof buttonColors

  const buttonColors = {
    secondary:
      'hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white fill-black dark:fill-white',
    dangerSecondary: 'hover:bg-red-500 text-red-500 hover:text-white',
    success: 'hover:bg-green-600 text-green-500 hover:text-white',
    warning: 'hover:bg-yellow-600 text-yellow-300 hover:text-black',
  }

  export let color: ButtonColor = 'secondary'
  export let link = false
  export let href = ''
  export let loading = false
  export let disabled = false

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
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm
      transition-colors {buttonColors[
        color
      ]} disabled:opacity-50 disabled:pointer-events-none"
      {disabled}
    >
      {#if loading}
        <Spinner width={16} />
      {:else}
        <slot name="icon" />
      {/if}
      <slot />
    </button>
  {/if}
</li>
