<script lang="ts">
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import type { Alignment } from '$lib/components/ui/menu/menu.js'
  import { Button } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'

  type T = $$Generic

  export let options: T[]
  export let optionNames: string[] = []
  export let selected: T
  export let label: string | undefined = undefined
  export let alignment: Alignment = 'bottom-left'

  let open = false

  const dispatcher = createEventDispatcher<{ select: T }>()
</script>

{#if label}
  <div class="block font-bold text-sm w-max">{label}</div>
{/if}
<Menu let:toggleOpen {alignment}>
  <div let:toggleOpen slot="button" class="w-max relative">
    <Button on:click={toggleOpen} color="secondary">
      <slot>
        {optionNames[options.findIndex((o) => selected == o)] || selected}
      </slot>
    </Button>
  </div>
  {#each options as option, index}
    <MenuButton
      on:click={() => {
        selected = option
        dispatcher('select', option)
      }}
    >
      {optionNames[index] || option}
    </MenuButton>
  {/each}
</Menu>
