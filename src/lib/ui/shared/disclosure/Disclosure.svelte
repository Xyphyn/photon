<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

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

<details {...rest} class={['w-full relative disclosure', clazz]} bind:open>
  <summary class="discosure-summary">
    {@render summary?.({ open })}
  </summary>
  {@render extended?.()}
  <div class="expand">
    {@render children?.({ open })}
  </div>
</details>

<style>
  .disclosure {
    interpolate-size: allow-keywords;
    will-change: height;
  }

  .disclosure::details-content {
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      height 0.5s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1),
      content-visibility 0.4s allow-discrete;
  }

  .disclosure[open]::details-content {
    height: auto;
    opacity: 1;
  }

  summary {
    list-style: none;
  }
</style>
