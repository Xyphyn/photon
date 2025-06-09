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
  class="border rounded-full border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-1 flex items-center gap-1 w-max max-w-full z-0 relative overflow-auto"
>
  {#each options as option, index}
    {@const slctd = selected == option}
    <button
      class={[
        'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-75 relative',
        slctd
          ? 'bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900'
          : 'dark:bg-zinc-900/50 bg-white',
      ]}
      onclick={e => {
        e.preventDefault()
        selected = option
      }}
      disabled={disabled[index] ?? false}
      type="button"
    >
      {optionNames[index] || option}
      {#if slctd}
        <div
          class="absolute left-0 top-0 w-full h-full blur-xl scale-75 opacity-50 dark:bg-primary-100 -z-10"
        ></div>
      {/if}
    </button>
  {/each}
</div>
{@render children?.({ selected })}
