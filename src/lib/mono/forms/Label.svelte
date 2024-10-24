<script lang="ts">
  let forID: string | undefined = undefined
  export { forID as for }
  /**
   * The `text` prop will take precedence over the slot.
   */
  export let text: string | undefined = undefined
  let clazz: string = ''
  export { clazz as class }
</script>

<svelte:element
  this={forID ? 'label' : 'span'}
  {...$$restProps}
  for={forID}
  class="text-sm text-slate-800 dark:text-zinc-200 font-medium w-full {clazz ||
    ''}"
>
  {#if text}
    {text}
  {:else if $$slots.default}
    <slot />
  {/if}
</svelte:element>
