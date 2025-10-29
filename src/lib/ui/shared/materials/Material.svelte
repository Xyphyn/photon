<script lang="ts">
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
    none: '',
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    elevation?: Elevation
    padding?: Padding
    rounding?: Rounding
    color?: Color
    element?: string
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
  {@render children?.()}
</svelte:element>

<style>
  @reference '../../../../app.css';

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
        @variant dark {
          background-color: var(--color-zinc-925);
        }
      }
    }

    @variant hover {
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
</style>
