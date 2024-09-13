<script lang="ts">
  import { generateID } from '../forms/helper.js'

  type T = $$Generic

  export let value: T
  export let group: T
  export let inlineDescription: boolean = false
  export let id: string = generateID()
  export let disabled: boolean = false
</script>

<div
  class="font-normal cursor-pointer text-sm flex flex-row items-baseline gap-2"
>
  <input
    {...$$restProps}
    {id}
    type="radio"
    bind:group
    {value}
    on:blur
    on:change
    {disabled}
    class="cursor-pointer disabled:cursor-not-allowed peer disabled:opacity-50"
  />
  <label
    for={id}
    class="inline-flex {inlineDescription
      ? 'flex-row'
      : 'flex-col'} cursor-pointer peer-disabled:cursor-not-allowed font-medium gap-1 peer-disabled:opacity-50"
  >
    <slot />
    {#if $$slots.description}
      <span class="font-normal text-slate-600 dark:text-zinc-400">
        <slot name="description" />
      </span>
    {/if}
  </label>
</div>
