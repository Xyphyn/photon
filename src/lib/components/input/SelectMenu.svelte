<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'

  import { Color } from '$lib/ui/colors'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'

  type T = $$Generic

  export let options: T[]
  export let optionNames: string[]
  export let selected: T

  let open = false
</script>

<Menu let:toggleOpen>
  <Button slot="button" on:click={toggleOpen} color="tertiary" size="square-md">
    <slot />
  </Button>
  {#each options as option, index}
    <MenuButton on:click={() => (selected = option)}>
      {optionNames[index] || option}
    </MenuButton>
  {/each}
</Menu>
