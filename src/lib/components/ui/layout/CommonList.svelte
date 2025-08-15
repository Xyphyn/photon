<script lang="ts" generics="T">
  import type { Snippet } from 'svelte'

  const sizeDelay: Record<'lg' | 'md' | 'sm', number> = {
    lg: 120,
    md: 80,
    sm: 40,
  }

  interface Props {
    items?: T[]
    item?: Snippet<[T, number]>
    children?: Snippet
    animate?: boolean
    size?: 'lg' | 'md' | 'sm'
  }

  let {
    items,
    item: itemSnippet,
    children,
    animate = true,
    size = 'sm',
  }: Props = $props()
</script>

<ul class="divide-y-3 divide-slate-50 dark:divide-zinc-925">
  {#if items}
    {#each items as item, index (item)}
      <li
        class={['group/li', animate && 'animate']}
        style="--i: {index < 10 ? index * sizeDelay[size] : 0}ms;"
      >
        {@render itemSnippet?.(item, index)}
      </li>
    {/each}
  {/if}
  {@render children?.()}
</ul>

<style>
  ul > :global(li) {
    padding-block: calc(var(--spacing) * 3);
    padding-inline: calc(var(--spacing) * 3.5);
    transition: background-color 0.1s;
    background-color: var(--color-white);
    container-type: inline-size;

    border-radius: var(--radius-md) var(--radius-md);

    &:first-child {
      border-top-left-radius: var(--radius-2xl);
      border-top-right-radius: var(--radius-2xl);
    }
    &:last-child {
      border-bottom-left-radius: var(--radius-2xl);
      border-bottom-right-radius: var(--radius-2xl);
    }

    &:hover {
      background-color: var(--color-slate-25);
    }
  }

  @media screen and (min-width: 40rem) {
    ul > :global(li) {
      padding-block: calc(var(--spacing) * 3);
      padding-inline: calc(var(--spacing) * 4);
    }
  }

  :global(.dark) ul > :global(li) {
    background-color: var(--color-zinc-950);

    &:hover {
      background-color: color-mix(
        in oklab,
        var(--color-zinc-925),
        var(--color-zinc-900)
      );
    }
  }

  @keyframes pop-in {
    from {
      transform: translateY(16px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  .animate {
    --delay: var(--i, 0ms);
  }

  :global(.animate > *:only-child) {
    animation: pop-in 1s forwards cubic-bezier(0.16, 1, 0.3, 1);
    animation-delay: var(--delay, 0ms);
    opacity: 0;
  }

  :global(.animate:not(:has(> * + *))) {
    animation: pop-in 1s forwards cubic-bezier(0.16, 1, 0.3, 1);
    animation-delay: var(--delay, 0ms);
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.animate > *:only-child) {
      animation: none;
      opacity: 1;
    }
    :global(.animate:not(:has(> * + *))) {
      animation: none;
      opacity: 1;
    }
  }
</style>
