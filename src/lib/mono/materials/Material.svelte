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
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  }

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-xs',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  const colorClass = {
    default:
      'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700',
    distinct:
      'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700',
    transparent:
      'border border-slate-200 dark:border-zinc-900 border-b-slate-300 dark:border-t-zinc-800',
    uniform:
      'bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900',
    none: '',
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    elevation?: Elevation
    padding?: Padding
    rounding?: Rounding
    color?: Color
    element?: string
    class?: ClassValue
    children?: import('svelte').Snippet
  }

  let {
    elevation = 'flat',
    padding = 'md',
    rounding = 'lg',
    color = 'default',
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
