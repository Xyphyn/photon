<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import type { Snippet } from 'svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons'

  interface Props extends ButtonProps {
    label: string
    icon?: IconSource | undefined
    href?: string | undefined
    adaptive?: boolean
    isSelectedFilter?: (path: string) => boolean
    class?: string
    customIcon?: Snippet<[{ size: number; isSelected?: boolean }]>
    children?: Snippet
  }

  let {
    label,
    icon,
    href,
    adaptive = true,
    isSelectedFilter = (path) => href != undefined && path == href,
    class: clazz = '',
    customIcon,
    children,
    ...rest
  }: Props = $props()

  let isSelected = $derived(isSelectedFilter(page.url.pathname))
</script>

<Button
  {...rest}
  color="none"
  rounding="none"
  class={[
    'nav-btn',
    adaptive && 'nav-btn-dynamic',
    isSelected && 'nav-btn-selected',
    clazz,
  ]}
  shadow="none"
  size="custom"
  {href}
  title={label}
  aria-selected={isSelected}
>
  {#snippet prefix()}
    {#if icon}
      <div class="hidden lg:block">
        <Icon src={icon} size="16" micro />
      </div>
      <div class="block lg:hidden">
        <Icon src={icon} size="20" mini />
      </div>
    {:else}
      {@render customIcon?.({ size: 16, isSelected })}
    {/if}
  {/snippet}
  <span class="hidden {adaptive ? 'lg:block' : ''}">{label}</span>
  {@render children?.()}
</Button>

<style>
  @reference '../../../../app.css';

  :global {
    .nav-btn {
      width: calc(var(--spacing) * 10);
      height: calc(var(--spacing) * 10);
      border-radius: 9999px;

      color: var(--color-slate-500);

      @variant dark {
        color: var(--color-zinc-400);
      }

      @variant hover {
        color: var(--color-slate-900);
        @variant dark {
          color: var(--color-zinc-50);
        }
      }

      transition-property: color;
    }

    .nav-btn-dynamic {
      @variant lg {
        width: max-content;
      }
    }

    .nav-btn-selected {
      color: var(--color-primary-900);
      @variant dark {
        color: var(--color-primary-100);
      }

      @variant max-lg {
        background-color: var(--color-slate-200);
        @variant dark {
          background-color: var(--color-zinc-800);
        }
      }
    }
  }
</style>
