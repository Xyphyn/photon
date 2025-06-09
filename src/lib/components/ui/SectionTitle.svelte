<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    small?: boolean
    class?: string
    children?: import('svelte').Snippet
  }

  let { small = false, class: clazz = '', children, ...rest }: Props = $props()
</script>

<span {...rest} class="{!small ? 'text-lg' : 'text-xs'} font-medium {clazz}">
  {@render children?.()}
</span>
