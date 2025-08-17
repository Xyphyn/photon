<script lang="ts">
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
    <button
      class={[
        'px-2.5 py-1 rounded-xl text-sm font-medium transition-colors duration-75 relative cursor-pointer',
        slctd
          ? 'bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900 hover:brightness-90 active:brightness-75'
          : ' border dark:bg-zinc-900/50 bg-white border-slate-200 dark:border-zinc-800 hover:bg-slate-100 hover:dark:bg-zinc-800 active:bg-slate-200 active:dark:bg-zinc-900',
      ]}
      onclick={e => {
        e.preventDefault()
        selected = option
      }}
      disabled={disabled[index] ?? false}
      type="button"
    >
      {optionNames[index] || option}
    </button>
  {/each}
</div>
{@render children?.({ selected })}
