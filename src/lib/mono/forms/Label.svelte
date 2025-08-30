<script lang="ts">
  import type { ClassValue, HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    for?: string | undefined
    /**
     * The `text` prop will take precedence over the slot.
     */
    text?: string | undefined
    class?: ClassValue
    children?: import('svelte').Snippet
  }

  let {
    for: forID = undefined,
    text = undefined,
    class: clazz = '',
    children,
    ...rest
  }: Props = $props()
</script>

<label
  {...rest}
  for={forID}
  class={['text-sm text-slate-800 dark:text-zinc-200 font-medium', clazz]}
>
  {#if text}
    {text}
  {:else if children}
    {@render children?.()}
  {/if}
</label>
