<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    children: Snippet
    class?: ClassValue
  }

  let { children, class: clazz }: Props = $props()
</script>

<div
  class={['text-loader font-medium text-lg tracking-tight', clazz]}
  aria-busy="true"
  aria-live="polite"
>
  {@render children?.()}
</div>

<style>
  .text-loader {
    color: transparent;
    background: linear-gradient(
      to right,
      var(--color-zinc-500),
      var(--color-zinc-50),
      var(--color-zinc-500)
    );
    background-size: 200%;
    background-clip: text;
    display: inline;
    width: max-content;
    animation: pulse 1s infinite linear;
  }

  @keyframes pulse {
    0% {
      background-position: 100%;
    }
    50% {
      background-position: 0%;
    }
    100% {
      background-position: -100%;
    }
  }
</style>
