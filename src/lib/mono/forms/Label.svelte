<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue, HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    for?: string | undefined
    /**
     * The `text` prop will take precedence over the slot.
     */
    text?: string | undefined
    class?: ClassValue
    customText?: Snippet
  }

  let {
    for: forID = undefined,
    text = undefined,
    class: clazz = '',
    customText,
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
    <div class="inline-block">{text}</div>
  {:else if customText}
    {@render customText?.()}
  {/if}
  {@render children?.()}
</label>
