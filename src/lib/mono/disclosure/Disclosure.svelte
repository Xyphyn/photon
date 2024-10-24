<script lang="ts">
  import { backOut, expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  export let open: boolean = false
  let clazz: string = ''
  export { clazz as class }
</script>

<div {...$$restProps} class={clazz}>
  <button on:click={() => (open = !open)} class="w-full">
    <slot name="summary" {open} />
  </button>
  <slot name="extended" />
  {#if open}
    <div transition:slide={{ axis: 'y', easing: expoOut, duration: 300 }}>
      <slot {open} />
    </div>
  {/if}
</div>
