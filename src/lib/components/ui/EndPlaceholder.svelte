<script lang="ts">
  import type { ClassValue } from 'svelte/elements'

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const margins = {
    none: '',
    sm: 'mt-3 mb-1 px-3',
    md: 'mt-4 mb-2',
    lg: 'mt-5 mb-3',
  }

  const colors = {
    subtle: 'text-slate-600 dark:text-zinc-400',
    none: '',
  }

  interface Props {
    class?: ClassValue
    size?: keyof typeof sizes
    color?: keyof typeof colors
    margin?: keyof typeof margins
    border?: boolean
    children?: import('svelte').Snippet
    action?: import('svelte').Snippet
  }

  let {
    class: clazz = '',
    children,
    action,
    border = true,
    size = 'sm',
    color = 'subtle',
    margin = 'none',
  }: Props = $props()
</script>

<div
  class={[
    'flex flex-row items-center gap-2 flex-wrap',
    sizes[size],
    colors[color],
    margins[margin],
    clazz,
  ]}
>
  <h3 class="font-medium text-left">
    {@render children?.()}
  </h3>
  <div
    class={[
      'flex-1 border-slate-200/70 dark:border-zinc-800 border-b',
      !border && 'opacity-0',
    ]}
  ></div>
  {@render action?.()}
</div>
