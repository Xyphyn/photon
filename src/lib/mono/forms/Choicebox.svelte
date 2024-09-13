<script lang="ts">
  import { generateID } from '../forms/helper.js'
  import Material from '../materials/Material.svelte'

  type T = $$Generic

  export let value: T | undefined = undefined
  export let group: T | undefined = undefined
  export let id: string = generateID()
  export let disabled: boolean = false
  export let title: string | undefined = undefined
  export let description: string | undefined = undefined
  export let type: 'radio' | 'checkbox' = 'radio'
  export let checked: boolean | undefined = undefined

  // prettier-ignore
  $: selected = type == 'checkbox' ? checked
    : group != undefined
      ? group == value : false
</script>

<Material
  class="transition-colors duration-100
  {selected ? 'bg-blue-200 dark:bg-blue-950 border-blue-400' : ''}"
>
  <label
    for={id}
    class="w-full h-full flex flex-row-reverse cursor-pointer items-center gap-4"
  >
    {#if type == 'radio'}
      <input
        {...$$restProps}
        {id}
        type="radio"
        {value}
        on:blur
        bind:group
        {disabled}
        class="h-max w-max peer pr-4"
      />
    {:else if type == 'checkbox'}
      <input
        {...$$restProps}
        {id}
        type="checkbox"
        {value}
        on:blur
        bind:checked
        {disabled}
        class="h-max w-max peer pr-4"
      />
    {/if}
    <div class="flex flex-col space-y-1 w-full h-full">
      {#if $$slots.title || title}
        <h1 class="font-medium">
          {#if $$slots.title}
            <slot name="title" />
          {:else if title}
            {title}
          {/if}
        </h1>
      {/if}
      {#if $$slots.description || description}
        <p class="text-sm text-slate-600 dark:text-zinc-400">
          {#if $$slots.description}
            <slot name="description" />
          {:else if description}
            {description}
          {/if}
        </p>
      {/if}
    </div>
  </label>
</Material>
