<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'

  import SelectMenu from '$lib/components/input/SelectMenu.svelte'

  import { createEventDispatcher } from 'svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  type T = $$Generic
  export let options: T[]
  export let disabled: boolean[] = []
  export let optionNames: string[] = []
  export let selected: T

  const dispatcher = createEventDispatcher<{ select: T }>()

  let extraSelected: T | null = null
  $: dispatcher('select', selected)
</script>

<div
  class="flex overflow-auto flex-row items-center max-w-full w-max bg-slate-100
  rounded-lg dark:bg-zinc-900 gap-1 p-1 border border-slate-200 dark:border-zinc-800
  {$$props.class}"
>
  {#each options.slice(0, 4) as option, index}
    <button
      class="px-3 py-1.5 text-sm rounded-md
             transition-colors
            {selected == option
        ? 'bg-slate-900 text-slate-50 dark:bg-zinc-100 dark:text-black\
                hover:bg-slate-800 hover:dark:bg-zinc-300'
        : '  hover:bg-slate-200 hover:dark:bg-zinc-800'}
        disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap"
      on:click={() => (selected = option)}
      disabled={disabled[index] ?? false}
    >
      {optionNames[index] || option}
    </button>
  {/each}
  {#if options.length > 4}
    <select
      bind:value={selected}
      class="bg-inherit text-sm mr-2 p-1.5 rounded-md {options
        .slice(4)
        .includes(selected)
        ? 'bg-slate-900 text-slate-50 dark:bg-zinc-100 dark:text-black w-max'
        : 'w-4'}"
    >
      <Button color="tertiary">
        <Icon src={ChevronDown} size="16" mini />
      </Button>
      {#each options.slice(4) as option, index}
        <option value={option}>{optionNames[index + 4] || option}</option>
      {/each}
    </select>
  {/if}
</div>
<slot {selected} />

<style lang="postcss">
  .custom-select {
    @apply bg-slate-50 relative;
  }

  .custom-select select {
    appearance: none;
    @apply bg-inherit hidden;
  }
</style>
