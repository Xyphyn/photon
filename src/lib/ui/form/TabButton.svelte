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
    'tab-button',
    selected ? 'btn-primary' : 'btn-secondary',
  ]}
  onclick={href ? undefined : onselect}
  {disabled}
  {href}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  @reference '../../../app.css';

  .tab-button {
    font-size: var(--text-sm);
    border-radius: var(--radius-xl);
    font-weight: var(--font-weight-medium);
    transition: all 75ms var(--default-transition-timing-function);
    position: relative;
    box-shadow: var(--shadow-xs);
    cursor: pointer;
  }
</style>
