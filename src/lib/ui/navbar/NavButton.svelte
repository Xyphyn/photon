<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import type { Snippet } from 'svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons/dist'

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
    <div class="prefix">
      {#if customIcon}
        {@render customIcon?.({ size: 16, isSelected })}
      {:else if icon}
        <div class="hidden md:block">
          <Icon src={icon} size="16" micro />
        </div>
        <div class="block md:hidden">
          <Icon src={icon} size="20" mini />
        </div>
      {/if}
    </div>
  {/snippet}
  <span class="hidden {adaptive ? 'md:block' : ''}">{label}</span>
  {@render children?.()}
</Button>

<style>
  @reference '../../../app.css';

  :global {
    .prefix {
      @variant max-md {
        height: 100%;
        display: grid;
        place-items: center;
        aspect-ratio: 1 / 1;
        border-radius: 100%;
      }
    }

    .nav-btn {
      width: calc(var(--spacing) * 10);
      height: calc(var(--spacing) * 10);

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
      @variant md {
        width: max-content;
      }
    }

    .nav-btn-selected {
      color: var(--color-primary-900);
      @variant dark {
        color: var(--color-primary-100);
      }

      @variant max-md {
        .prefix {
          background-color: var(--color-slate-200);
          @variant dark {
            background-color: var(--color-zinc-800);
          }
        }
      }
    }

    @variant max-md {
      .nav-btn-sm-primary .prefix {
        background-color: var(--color-primary-900);
        color: var(--color-slate-50);

        @variant hover {
          color: var(--color-slate-50);
        }

        @variant dark {
          background-color: var(--color-primary-100);
          color: var(--color-zinc-900);
          @variant hover {
            color: var(--color-zinc-900);
          }
        }
      }
    }
  }
</style>
