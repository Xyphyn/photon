<script lang="ts">
  import { ChevronDown, Icon } from 'svelte-hero-icons'

  import Button from '$lib/components/input/Button.svelte'
  import { createEventDispatcher } from 'svelte'
  type T = $$Generic
  export let options: T[]
  export let disabled: boolean[] = []
  export let optionNames: string[] = []
  export let selected: T
  export let headless: boolean = false

  const dispatcher = createEventDispatcher<{ select: T }>()

  $: {
    dispatcher('select', selected)
  }

  let containerClass = `
    flex flex-row items-center w-max max-w-full overflow-auto
    ${
      headless
        ? 'pb-1'
        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1'
    }
    gap-1
    ${$$props.class}
  `

  const buttonClass = (selected: boolean) => `
    px-3 py-1.5 text-sm
    ${!selected ? 'hover:bg-slate-100 hover:dark:bg-zinc-800' : ''}
     transition-colors rounded-md
    ${
      selected
        ? headless
          ? ''
          : 'bg-slate-900 text-slate-50 dark:bg-zinc-100 dark:text-black hover:bg-slate-800 hover:dark:bg-zinc-300'
        : ''
    }
    disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap
    relative
  `
</script>

<div class={containerClass}>
  {#each options.slice(0, 4) as option, index}
    <button
      class={buttonClass(selected == option)}
      on:click|preventDefault={() => (selected = option)}
      disabled={disabled[index] ?? false}
      type="button"
    >
      {optionNames[index] || option}
      {#if headless && option == selected}
        <div
          class="absolute -bottom-1 left-0 w-full border-b-2 rounded-t-sm border-black dark:border-white"
        />
      {/if}
    </button>
  {/each}
  {#if options.length > 4}
    <select
      bind:value={selected}
      class="bg-inherit text-sm mr-2 p-1.5 rounded-md cursor-pointer {options
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
