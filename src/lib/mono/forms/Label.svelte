<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    for?: string | undefined
    /**
     * The `text` prop will take precedence over the slot.
     */
    text?: string | undefined
    class?: string
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

<svelte:element
  this={forID ? 'label' : 'span'}
  {...rest}
  for={forID}
  class="text-sm text-slate-800 dark:text-zinc-200 font-medium w-full {clazz ||
    ''}"
>
  {#if text}
    {text}
  {:else if children}
    {@render children?.()}
  {/if}
</svelte:element>
