<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  type T = $$Generic
  export let options: T[]
  export let disabled: boolean[] = []
  export let optionNames: string[] = []
  export let selected: T
  let clazz = ''
  export { clazz as class }
  const dispatcher = createEventDispatcher<{ select: T }>()
  $: {
    dispatcher('select', selected)
  }
</script>

<div
  class="flex overflow-hidden flex-row items-center w-max bg-slate-100
         rounded-lg dark:bg-zinc-900 gap-1 p-1 border border-slate-200 dark:border-zinc-800"
>
  {#each options as option, index}
    <button
      class="px-3 py-1.5 text-sm rounded-md
             transition-colors
            {selected == option
        ? 'bg-black text-white dark:bg-white dark:text-black\
                hover:bg-zinc-900 hover:dark:bg-zinc-300'
        : '  hover:bg-slate-200 hover:dark:bg-zinc-800'}
        {clazz}
        disabled:opacity-60 disabled:pointer-events-none"
      on:click={() => (selected = option)}
      disabled={disabled[index] ?? false}
    >
      {optionNames[index] || option}
    </button>
  {/each}
</div>
<slot {selected} />
