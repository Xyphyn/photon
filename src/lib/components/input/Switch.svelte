<script lang="ts">
  import { ChevronDown, Icon } from 'svelte-hero-icons'
  import { Button } from 'mono-svelte'

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
        ? 'pb-1 gap-1'
        : 'gap-1.5'
    }
    ${$$props.class}
  `

  const buttonClass = (selected: boolean) => `
    px-3.5 py-1.5 text-sm
    ${!selected ? 'hover:bg-slate-100 hover:dark:bg-zinc-800' : ''}
     transition-colors rounded-full
    ${
      selected
        ? headless
          ? ''
          : 'bg-primary-900 text-slate-50 dark:bg-primary-100 dark:text-black hover:bg-slate-800 hover:dark:bg-zinc-300'
        : headless
	  ? ''
	  : 'bg-slate-100 dark:bg-zinc-800'
    }
    disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap
    relative
  `
</script>

<div class={containerClass}>
  {#each options as option, index}
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
</div>
<slot {selected} />
