<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface Props extends HTMLButtonAttributes {
    selected?: boolean
    children: Snippet
    [key: string]: any
  }

  let {
    selected = false,
    onselect,
    disabled,
    children,
    href,
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  class={[
    'px-2.5 py-1 rounded-xl text-sm font-medium transition-colors duration-75 relative cursor-pointer',
    selected
      ? 'bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900 hover:brightness-90 active:brightness-75'
      : ' border dark:bg-zinc-900/50 bg-white border-slate-200 dark:border-zinc-800 hover:bg-slate-100 hover:dark:bg-zinc-800 active:bg-slate-200 active:dark:bg-zinc-900',
  ]}
  onclick={href ? undefined : onselect}
  {disabled}
  {href}
  {...rest}
>
  {@render children?.()}
</svelte:element>
