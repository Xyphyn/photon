<script lang="ts">
  import { getContext } from 'svelte'

  interface Props {
    depth?: number
    raw?: string | undefined
    children?: import('svelte').Snippet
  }

  const options = getContext<{ inline: boolean }>('options')

  let { depth = 0, raw = undefined, children }: Props = $props()
</script>

{#if depth === 1}
  <h1 class={[options.inline && 'inline']}>
    {@render children?.()}
  </h1>
{:else if depth === 2}
  <h2 class={[options.inline && 'inline']}>
    {@render children?.()}
  </h2>
{:else if depth === 3}
  <h3 class={[options.inline && 'inline']}>
    {@render children?.()}
  </h3>
{:else if depth === 4}
  <h4 class={[options.inline && 'inline']}>{@render children?.()}</h4>
{:else if depth === 5}
  <h5 class={[options.inline && 'inline']}>{@render children?.()}</h5>
{:else if depth === 6}
  <h6 class={[options.inline && 'inline']}>{@render children?.()}</h6>
{:else}
  {raw}
{/if}

<style>
  h1,
  h2,
  h3 {
    letter-spacing: var(--tracking-tight);
    font-weight: var(--font-weight-semibold);
  }

  h4,
  h5,
  h6 {
    letter-spacing: var(--tracking-tight);
    font-weight: var(--font-weight-medium);
  }

  h1 {
    font-size: var(--text-4xl);
  }
  h2 {
    font-size: var(--text-3xl);
  }
  h3 {
    font-size: var(--text-2xl);
  }
  h4 {
    font-size: var(--text-xl);
  }
  h5 {
    font-size: var(--text-lg);
  }
  h6 {
    font-size: var(--text-base);
  }

  h1.inline {
    font-size: var(--text-2xl);
  }
  h2.inline {
    font-size: var(--text-xl);
  }
  h3.inline {
    font-size: var(--text-lg);
  }
</style>
