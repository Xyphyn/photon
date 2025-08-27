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

  $effect(() => {
    onselect?.(selected)
  })
</script>

<div
  class="flex items-center gap-1 w-max max-w-full z-0 relative overflow-auto"
>
  {#each options as option, index}
    {@const slctd = selected == option}
    <TabButton
      selected={slctd}
      onselect={() => (selected = option)}
      disabled={disabled[index]}
      type="button"
    >
      {optionNames[index] || option}
    </TabButton>
  {/each}
</div>
{@render children?.({ selected })}
