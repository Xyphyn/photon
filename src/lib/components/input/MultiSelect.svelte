<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  type T = $$Generic
  export let options: T[]
  export let disabled: boolean[] = []
  export let optionNames: string[] = []
  export let selected: T
  const dispatcher = createEventDispatcher<{ select: T }>()
  $: {
    dispatcher('select', selected)
  }
</script>

<div
  class="flex overflow-auto flex-row items-center max-w-full w-max bg-slate-100
  rounded-lg dark:bg-zinc-900 gap-1 p-1 border border-slate-200 dark:border-zinc-800
  {$$props.class}"
>
  {#each options as option, index}
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
</div>
<slot {selected} />
