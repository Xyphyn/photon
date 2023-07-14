<script lang="ts">
  import { expoOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'

  export let open = false

  let clazz = ''
  export { clazz as class }

  export let itemsClass = ''

  export let absolute = false
  export let rtl = true
  export let top = false

  let element: any

  export const toggleOpen = () => (open = !open)
</script>

<svelte:body
  on:click={(e) => {
    if (!element.contains(e.target)) {
      open = false
    }
  }}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="overflow-visible z-30 {absolute
    ? 'absolute'
    : 'relative'} cursor-auto {clazz}"
  bind:this={element}
>
  <slot name="button" {toggleOpen} />
  {#if open}
    <div
      transition:scale|local={{
        duration: 200,
        start: 0.95,
        easing: expoOut,
      }}
      class="absolute max-h-64 z-30 overflow-auto {rtl
        ? 'origin-top-right right-0'
        : 'origin-top-left left-0'}
              {top ? 'bottom-[100%] origin-bottom-left' : 'top-[100%]'}
          rounded-md py-2 min-w-[16rem] my-2 flex flex-col shadow-md {itemsClass
        ? itemsClass
        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'}"
    >
      {#if open}
        <slot {toggleOpen} />
      {/if}
    </div>
  {/if}
</div>
