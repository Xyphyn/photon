<script lang="ts" module>
  import { Menu, MenuButton, Spinner, TextInput } from 'mono-svelte'
  import type { TextInputProps } from 'mono-svelte/forms/TextInput.svelte'
  import { debounce } from 'mono-svelte/util/time'
  import { Icon, MagnifyingGlass } from 'svelte-hero-icons/dist'

  interface Props<T> extends Omit<TextInputProps, 'onselect' | 'children'> {
    query?: string
    selected?: T | undefined
    search: (query: string) => Promise<T[]>
    extractName: (item: T) => string
    select?: (item?: T) => void
    input?: import('svelte').Snippet
    noresults?: import('svelte').Snippet
    required?: boolean
    children?: import('svelte').Snippet<
      [
        {
          select: (item?: T) => void
          item: T
          extractName: (item: T) => string
        },
      ]
    >
    onselect?: (value?: T) => void
    oninput?: TextInputProps['oninput']
  }

  export type { Props as SearchProps }
</script>

<script lang="ts" generics="T">
  let items: T[] = $state([])

  /**
   * This is here so that the menu doesn't open as soon as it's mounted.
   */
  let openMenu = $state(false)
  let searching = $state(false)

  let {
    query = $bindable(''),
    selected = $bindable(undefined),
    search,
    extractName,
    select = (item?: T) => {
      if (item == null) return
      selected = item
      query = extractName(item)
      onselect?.(item)
    },
    required,
    input,
    noresults,
    children,
    onselect,
    oninput,
    ...rest
  }: Props<T> = $props()

  const debounceFunc = debounce(async () => {
    searching = true
    openMenu = true
    items = await search(query)
    searching = false
  })
</script>

<div class="relative">
  <Menu bind:open={openMenu}>
    {#snippet target(attachment)}
      {#if input}{@render input()}{:else}
        <TextInput
          {@attach attachment}
          bind:value={query}
          oninput={(e) => {
            searching = true
            openMenu = true
            oninput?.(e)
            debounceFunc()
          }}
          onfocus={(e) => {
            searching = true
            openMenu = true
            oninput?.(e)
            debounceFunc()
          }}
          {required}
          {...rest}
          inlineAffixes
        >
          {#snippet prefix()}
            <div class="h-5 flex items-center">
              <Icon src={MagnifyingGlass} mini size="16" />
            </div>
          {/snippet}
        </TextInput>
      {/if}
    {/snippet}
    {#if searching}
      <div class="w-full h-24 grid place-items-center">
        <Spinner width={24} />
      </div>
    {:else if items.length == 0}
      <div class="text-center h-24 grid place-items-center">
        {#if noresults}{@render noresults()}{:else}No results found.{/if}
      </div>
    {:else}
      {#each items as item (item)}
        {#if children}{@render children({
            extractName,
            item,
            select,
          })}{:else}
          <MenuButton onclick={() => select(item)}>
            {extractName(item)}
          </MenuButton>
        {/if}
      {/each}
    {/if}
  </Menu>
</div>
