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
  class={[sizes[size], 'tab-button', selected && 'material-distinct']}
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
    border-radius: 9999px;
    font-weight: var(--font-weight-medium);
    position: relative;
    cursor: pointer;
    padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3.5);

    &:hover {
      background-color: --alpha(var(--color-slate-300) / 40%);
      @variant dark {
        background-color: --alpha(var(--color-zinc-700) / 50%);
      }
    }

    &:active {
      background-color: --alpha(var(--color-slate-400) / 40%);
      @variant dark {
        background-color: --alpha(var(--color-zinc-800) / 50%);
      }
    }
  }

  .tab-button-selected {
    background-color: --alpha(var(--color-slate-300) / 40%);
    @variant dark {
      background-color: --alpha(var(--color-zinc-700) / 50%);
    }

    &:hover {
      background-color: --alpha(var(--color-zinc-400) / 40%);
      @variant dark {
        background-color: --alpha(var(--color-zinc-600) / 50%);
      }
    }
  }
</style>
