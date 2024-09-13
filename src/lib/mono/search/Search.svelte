<script lang="ts">
  import { Menu, TextInput, Spinner, MenuButton } from '../index.js'
  import { debounce } from '../util/time.js'
  import { createEventDispatcher } from 'svelte'
  import { Icon, MagnifyingGlass } from 'svelte-hero-icons'

  export let query: string = ''

  type T = $$Generic
  let items: T[] = []

  export let selected: T | undefined = undefined

  export let search: (query: string) => Promise<T[]>
  export let extractName: (item: T) => string

  /**
   * This is here so that the menu doesn't open as soon as it's mounted.
   */
  let openMenu = false
  let searching = false

  const dispatcher = createEventDispatcher<{
    input: Event
    select: T | undefined
  }>()

  export let select = (item: T) => {
    selected = item
    query = extractName(item)
    dispatcher('select', item)
  }

  const debounceFunc = debounce(async () => {
    searching = true
    openMenu = true
    items = await search(query)
    searching = false
  })
</script>

<div class="relative">
  <Menu bind:open={openMenu}>
    <slot name="input" slot="target">
      <TextInput
        bind:value={query}
        on:input={(e) => {
          searching = true
          openMenu = true
          dispatcher('input', e)
          debounceFunc()
        }}
        on:focus={(e) => {
          searching = true
          openMenu = true
          dispatcher('input', e)
          debounceFunc()
        }}
        {...$$restProps}
        inlineAffixes
        slot="target"
      >
        <div slot="prefix" class="h-5 flex items-center">
          <Icon src={MagnifyingGlass} mini size="16" />
        </div>
      </TextInput>
    </slot>
    {#if searching}
      <div class="w-full h-24 grid place-items-center">
        <Spinner width={24} />
      </div>
    {:else if items.length == 0}
      <div class="text-center h-24 grid place-items-center">
        <slot name="noresults">No results found.</slot>
      </div>
    {:else}
      {#each items as item}
        <slot {extractName} {item} {dispatcher} {select}>
          <MenuButton on:click={() => select(item)}>
            {extractName(item)}
          </MenuButton>
        </slot>
      {/each}
    {/if}
  </Menu>
</div>
