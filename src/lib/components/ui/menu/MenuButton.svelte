<script lang="ts">
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { Color } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'

  type ButtonColor = keyof typeof buttonColors

  const buttonColors = {
    secondary:
      'hover:bg-gray-200/50 hover:dark:bg-zinc-600/20 text-slate-800 fill-slate-800 dark:text-zinc-200 dark:fill-zinc-200',
    dangerSecondary: 'hover:bg-red-500 text-red-500 hover:text-white',
    success:
      'hover:bg-green-600 text-green-600 dark:text-green-500 hover:text-white hover:dark:text-white',
    warning:
      'hover:bg-yellow-500 dark:text-yellow-300 text-yellow-600 hover:dark:text-black hover:text-black',
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
      ]} {disabled ? 'opacity-50 pointer-events-none' : ''}"
    >
      <slot />
    </a>
  {:else}
    <button
      on:click={(e) => click('click', e)}
      type="button"
      class="flex flex-row gap-2 items-center px-4 py-2 w-full text-sm
      transition-colors list-none {buttonColors[
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
