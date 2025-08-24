<script lang="ts">
  import type { ClassValue } from 'svelte/elements'

  const sizes = {
    xs: 'text-xs px-3 mt-3 mb-1',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const colors = {
    subtle: 'text-slate-600 dark:text-zinc-400',
    none: '',
  }

  interface Props {
    class?: ClassValue
    size?: keyof typeof sizes
    color?: keyof typeof colors
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
  }: Props = $props()
</script>

<div
  class={[
    'flex flex-row items-center gap-2 flex-wrap',
    sizes[size],
    colors[color],
    clazz,
  ]}
>
  <h3 class="font-medium text-left">
    {@render children?.()}
  </h3>
  <div
    class={[
      'flex-1 border-slate-200 dark:border-zinc-800  border-b',
      !border && 'opacity-0',
    ]}
  ></div>
  {@render action?.()}
</div>
