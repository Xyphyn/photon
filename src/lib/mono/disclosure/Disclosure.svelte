<script lang="ts">
  import type { Snippet } from 'svelte'
  import { expoOut } from 'svelte/easing'
  import type { ClassValue } from 'svelte/elements'
  import { slide } from 'svelte/transition'

  interface Props {
    open?: boolean
    class?: ClassValue
    summary?: Snippet<[{ open: boolean }]>
    extended?: Snippet
    children?: Snippet<[{ open: boolean }]>
  }

  let {
    open = $bindable(false),
    class: clazz = '',
    summary,
    extended,
    children,
    ...rest
  }: Props = $props()
</script>

<div {...rest} class={['w-full', clazz]}>
  <button onclick={() => (open = !open)} class="w-full">
    {@render summary?.({ open })}
  </button>
  {@render extended?.()}
  {#if open}
    <div transition:slide={{ axis: 'y', easing: expoOut, duration: 300 }}>
      {@render children?.({ open })}
    </div>
  {/if}
</div>
