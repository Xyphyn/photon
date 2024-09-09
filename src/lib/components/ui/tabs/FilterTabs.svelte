<script lang="ts">
  import { Button } from 'mono-svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'
  import TextProps from '../text/TextProps.svelte'

  type T = $$Generic

  export let items: T[]
  export let id: (item: T) => string | number | symbol

  let filters: Set<string | number | symbol> = new Set()

  $: filteredItems =
    filters.size > 0 ? items.filter((i) => filters.has(id(i))) : items
  $: uniqueIds = new Set(items.map(id))
</script>

<div class="flex flex-row overflow-auto space-x-2">
  {#if filters.size > 0}
    <div
      in:slide={{ duration: 300, easing: expoOut, axis: 'x' }}
      out:slide={{ duration: 300, easing: expoOut, axis: 'x', delay: 100 }}
    >
      <div
        out:fly={{ duration: 300, easing: expoOut, y: 6 }}
        in:fly={{ duration: 300, easing: expoOut, y: 6, delay: 100 }}
      >
        <Button
          on:click={() => {
            filters.clear()
            filters = filters
          }}
          color="ghost"
          class="text-inherit dark:text-inherit text-xs aspect-square h-full"
          rounding="pill"
          size="square-sm"
        >
          <Icon src={XMark} size="14" micro />
        </Button>
      </div>
    </div>
  {/if}
  {#each uniqueIds as identifier}
    <Button
      on:click={() => {
        if (filters.has(identifier)) filters.delete(identifier)
        else filters.add(identifier)
        filters = filters
      }}
      color={filters.has(identifier) ? 'primary' : 'ghost'}
      class="text-xs px-2.5"
      rounding="pill"
      size="sm"
    >
      <slot name="identifier" string={identifier}>
        <TextProps wrap="no-wrap">
          {identifier}
        </TextProps>
      </slot>
    </Button>
  {/each}
</div>

<slot items={filteredItems} />
