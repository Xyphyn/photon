<script lang="ts">
  import { Icon, type IconSource } from 'svelte-hero-icons/dist'
  import type { ClassValue, HTMLAttributes } from 'svelte/elements'

  type Elevation = keyof typeof elevationClass
  type Padding = keyof typeof paddingClass
  type Rounding = keyof typeof roundedClass
  type Color = keyof typeof colorClass

  const elevationClass = {
    flat: '',
    low: 'shadow-2xs',
    medium: 'shadow-xs',
    high: 'shadow-md',
    xhigh: 'shadow-lg',
    max: 'shadow-xl',
  }

  const paddingClass = {
    none: '',
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  }

  const roundedClass = {
    none: '',
    sm: 'rounded-xs',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  }

  const colorClass = {
    default: 'material-default',
    distinct: 'material-distinct',
    transparent: 'material-transparent',
    uniform: 'material-uniform',
    info: 'material-info',
    warning: 'material-warning',
    success: 'material-success',
    error: 'material-error',
    none: '',
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    elevation?: Elevation
    padding?: Padding
    rounding?: Rounding
    color?: Color
    element?: string
    icon?: IconSource
    class?: ClassValue
    children?: import('svelte').Snippet
    [key: string]: any
  }

  let {
    elevation = 'low',
    padding = 'md',
    rounding = 'xl',
    color = 'uniform',
    element = 'div',
    icon,
    class: clazz = '',
    children,
    ...rest
  }: Props = $props()
</script>

<svelte:element
  this={element}
  {...rest}
  class={[
    elevationClass[elevation],
    paddingClass[padding],
    roundedClass[rounding],
    colorClass[color],
    'text-sm',
    clazz,
  ]}
>
  {#if icon}
    <Icon
      src={icon}
      size="20"
      mini
      class="inline-block rounded-lg clear-both float-left mr-2"
    />
  {/if}
  {@render children?.()}
</svelte:element>

<style>
  @reference '../../../../app.css';

  :global {
    .material-default {
      background-color: white;
      border-width: 1px;
      border-color: var(--color-slate-200);

      @variant not-dark {
        border-bottom-color: var(--color-slate-300);
      }

      @variant dark {
        background-color: var(--color-zinc-900);
        border-color: var(--color-zinc-800);
        border-top-color: var(--color-zinc-700);

        @variant hover {
          background-color: var(--color-zinc-925);
        }
        @variant active {
          background-color: var(--color-zinc-950);
        }
      }

      @variant hover {
        background-color: var(--color-slate-50);
      }

      @variant active {
        background-color: var(--color-slate-100);
      }
    }

    .material-distinct {
      background-color: white;
      border-width: 1px;
      border-color: var(--color-slate-200);

      @variant not-dark {
        border-bottom-color: var(--color-slate-300);
      }

      @variant dark {
        background-color: var(--color-zinc-925);
        border-color: var(--color-zinc-800);
        border-top-color: var(--color-zinc-700);
      }
    }

    .material-transparent {
      border-width: 1px;
      border-color: var(--color-slate-200);

      @variant not-dark {
        border-bottom-color: var(--color-slate-300);
      }

      @variant dark {
        border-color: var(--color-zinc-900);
        border-top-color: var(--color-zinc-800);
      }
    }

    .material-uniform {
      background-color: white;
      border-width: 1px;
      border-color: var(--color-slate-200);

      @variant dark {
        background-color: var(--color-zinc-950);
        border-color: var(--color-zinc-900);
      }
    }

    .material-error {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-red-300) / 5%),
        --alpha(var(--color-red-500) / 15%)
      );

      color: var(--color-red-900);
      border: 1px solid --alpha(var(--color-red-300) / 30%);

      @variant dark {
        color: var(--color-red-300);
      }
    }

    .material-success {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-green-300) / 10%),
        --alpha(var(--color-green-500) / 15%)
      );

      color: var(--color-green-900);
      border: 1px solid --alpha(var(--color-green-300) / 30%);

      @variant dark {
        color: var(--color-green-300);
      }
    }

    .material-warning {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-yellow-300) / 5%),
        --alpha(var(--color-yellow-500) / 15%)
      );

      color: var(--color-yellow-900);
      border: 1px solid --alpha(var(--color-yellow-300) / 30%);

      @variant dark {
        color: var(--color-yellow-300);
      }
    }

    .material-info {
      background: linear-gradient(
        to bottom,
        --alpha(var(--color-slate-300) / 10%),
        --alpha(var(--color-slate-500) / 15%)
      );

      color: var(--color-slate-900);
      border: 1px solid --alpha(var(--color-slate-300) / 30%);

      @variant dark {
        color: var(--color-slate-300);
      }
    }
  }
</style>
