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
</script>

<svelte:body
  on:click={(event) => {
    let path = event.composedPath()

    if (!path.includes(element)) {
      if (open) {
        open = false
      }
    }
  }}
/>
<button
  class="overflow-visible z-30 {absolute
    ? 'absolute'
    : 'relative'} cursor-auto {clazz}"
  on:click={() => (open = !open)}
  bind:this={element}
>
  <slot name="button" />
  {#if open}
    <div
      transition:scale|local={{
        duration: 200,
        start: 0.95,
        easing: expoOut,
      }}
      class="absolute {rtl
        ? 'origin-top-right right-0'
        : 'origin-top-left left-0'}
              {top ? 'bottom-[100%] origin-bottom-left' : 'top-[100%]'}
          rounded-md py-2 min-w-[16rem] my-2 flex flex-col shadow-lg {itemsClass
        ? itemsClass
        : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'}"
    >
      {#if open}
        <slot />
      {/if}
    </div>
  {/if}
</button>
