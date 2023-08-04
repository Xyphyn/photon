<script lang="ts">
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'
  import { createEventDispatcher } from 'svelte'

  export let query: string
  export let debounceTime: number = 300

  type T = $$Generic

  export let options: T[]
  export let extractSelected: (item: T | null) => any
  export let extractName: (item: T) => string

  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  const dispatcher = createEventDispatcher<{ search: string }>()

  const debounceFunc = debounce(() => {
    dispatcher('search', query)
  }, debounceTime)
</script>

<div class="relative">
  <TextInput
    bind:value={query}
    on:input={() => {
      extractSelected(null)
      debounceFunc()
    }}
    {...$$restProps}
  />
  <Menu open={options.length != 0} alignment="bottom-left">
    {#each options as option}
      <MenuButton on:click={() => extractSelected(option)}>
        {extractName(option)}
      </MenuButton>
    {/each}
  </Menu>
</div>
