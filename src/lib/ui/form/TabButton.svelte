<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  const sizes = {
    sm: 'px-2.5 py-1',
    md: 'py-1.5 px-3.5',
  }

  interface Props extends HTMLButtonAttributes {
    selected?: boolean
    children: Snippet
    size?: keyof typeof sizes
    element?: 'div' | 'a' | 'button'
    [key: string]: any
  }

  let {
    selected = false,
    onselect,
    disabled,
    children,
    href,
    size = 'sm',
    element = href ? 'a' : 'button',
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={element}
  class={[
    sizes[size],
    'rounded-xl text-sm font-medium transition-colors duration-75 relative cursor-pointer border shadow-xs',
    selected
      ? 'border-transparent bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900 hover:brightness-90 active:brightness-75'
      : ' dark:bg-zinc-900/50 bg-white border-slate-200 dark:border-zinc-800 hover:bg-slate-100 hover:dark:bg-zinc-800 active:bg-slate-200 active:dark:bg-zinc-900',
  ]}
  onclick={href ? undefined : onselect}
  {disabled}
  {href}
  {...rest}
>
  {@render children?.()}
</svelte:element>
