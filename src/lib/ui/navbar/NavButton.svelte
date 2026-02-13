<script lang="ts">
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import type { ButtonProps } from 'mono-svelte/button/Button.svelte'
  import type { Snippet } from 'svelte'
  import { Icon, type IconSource } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'

  interface Props extends ButtonProps {
    label: string
    icon?: IconSource | undefined
    href?: string | undefined
    adaptive?: boolean
    isSelectedFilter?: (path: string) => boolean
    class?: ClassValue
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
        height: 90%;
        display: grid;
        place-items: center;
        aspect-ratio: 1 / 1;
        border-radius: var(--radius-xl);
      }
    }

    .nav-btn {
      border-radius: var(--radius-xl);
      width: calc(var(--spacing) * 10);
      height: calc(var(--spacing) * 10);
      @variant md {
        height: calc(var(--spacing) * 8);
      }
      transition: 125ms cubic-bezier(0.075, 0.82, 0.165, 1);

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

    .nav-btn .prefix {
      @variant max-md {
        @variant hover {
          background-color: --alpha(var(--color-slate-200) / 50%);
          @variant dark {
            background-color: --alpha(var(--color-zinc-700) / 30%);
          }
        }

        @variant active {
          background-color: --alpha(var(--color-slate-300) / 50%);
          @variant dark {
            background-color: --alpha(var(--color-zinc-800) / 30%);
          }
        }
      }
    }

    .nav-btn-dynamic {
      @variant md {
        width: max-content;
        height: max-content;
        padding: calc(var(--spacing) * 1.125) calc(var(--spacing) * 3);

        @variant hover {
          background-color: --alpha(var(--color-slate-200) / 50%);
          @variant dark {
            background-color: --alpha(var(--color-zinc-700) / 30%);
          }
        }

        @variant active {
          background-color: --alpha(var(--color-slate-300) / 50%);
          @variant dark {
            background-color: --alpha(var(--color-zinc-800) / 30%);
          }
        }
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

      @variant hover {
        cursor: default;
      }
    }

    .nav-btn-sm-primary .prefix {
      @variant max-md {
        background: radial-gradient(
          circle at 20% 0%,
          var(--color-primary-800),
          var(--color-primary-900)
        );
        color: var(--color-slate-50);
        border-radius: var(--radius-xl);
        background-size: 110% 110% !important;

        @variant hover {
          filter: brightness(120%);
          @variant dark {
            filter: brightness(90%);
          }
        }

        @variant dark {
          background: radial-gradient(
            circle at bottom right,
            var(--color-primary-200),
            var(--color-primary-100)
          );
          color: var(--color-zinc-900);
        }
      }
    }
  }
</style>
