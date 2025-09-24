<script lang="ts">
  import TabButton from './switch/TabButton.svelte'

  type T = $$Generic

  interface Props {
    options: T[]
    disabled?: boolean[]
    optionNames?: string[]
    selected: T
    children?: import('svelte').Snippet<[{ selected: T }]>
    onselect?: (item: T) => void
  }

  let {
    options,
    disabled = [],
    optionNames = [],
    selected = $bindable(),
    children,
    onselect,
  }: Props = $props()

  let selectedIndex = $state(0)
  let id = $props.id()

  /* you see id like this to be a super simple

  */
  $effect(() => {
    const newIndex = options.findIndex((i) => i === selected)
    if (newIndex !== -1) {
      selectedIndex = newIndex
    }
  })

  $effect(() => {
    const newSelected = options[selectedIndex]
    if (newSelected !== undefined && newSelected !== selected) {
      selected = newSelected
      onselect?.(newSelected)
    }
  })
</script>

<fieldset
  class="flex items-center gap-1 w-max max-w-full z-0 relative overflow-auto"
>
  {#each options as option, index}
    <label>
      <input
        type="radio"
        bind:group={selectedIndex}
        value={index}
        name={id}
        id="{id}-{option?.toString()}"
        class="hidden"
      />
      <TabButton
        selected={selectedIndex == index}
        disabled={disabled[index]}
        element="div"
      >
        {optionNames[index] || option}
      </TabButton>
    </label>
  {/each}
</fieldset>
{@render children?.({ selected })}
