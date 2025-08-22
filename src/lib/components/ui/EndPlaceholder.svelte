<script lang="ts">
  import type { ClassValue } from 'svelte/elements'

  const sizes = {
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
  <span class="font-medium text-left">
    {@render children?.()}
  </span>
  <hr
    class={[
      'flex-1 border-slate-200 dark:border-zinc-800',
      !border && 'opacity-0',
    ]}
  />
  {@render action?.()}
</div>
