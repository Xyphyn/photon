<script lang="ts" generics="T">
  import type { Snippet } from 'svelte'
  import type { ClassValue } from 'svelte/elements'
  const sizeDelay: Record<'lg' | 'md' | 'sm' | 'xs', number> = {
    lg: 120,
    md: 80,
    sm: 40,
    xs: 0,
  }

  interface Props {
    items?: T[]
    item?: Snippet<[T, number]>
    children?: Snippet
    animate?: boolean
    size?: 'lg' | 'md' | 'sm' | 'xs'
    class?: ClassValue
    selected?: (item: T) => boolean
  }

  let {
    items,
    item: itemSnippet,
    children,
    animate = true,
    size = 'sm',
    class: clazz,
    selected,
  }: Props = $props()
</script>

<ul>
  {#if items}
    {#each items as item, index (item)}
      <li
        class={[
          'group/li',
          animate && 'animate',
          size == 'xs' && 'xs',
          selected?.(item) && 'selected',
          clazz,
        ]}
        style="--i: {index < 10 ? index * sizeDelay[size] : 0}ms;"
      >
        {@render itemSnippet?.(item, index)}
      </li>
    {/each}
  {/if}
  {@render children?.()}
</ul>

<style>
  @reference '../../../app.css';
  ul {
    :global {
      :where(& > :not(:last-child)) {
        margin-block-start: calc(calc(var(--spacing) * 1));
        margin-block-end: calc(calc(var(--spacing) * 1));
      }
    }
  }
  ul > :global(li) {
    transition: background-color 0.1s;
    background-color: var(--color-white);
    container-type: inline-size;
    border: 1px solid
      color-mix(in oklab, var(--color-slate-50), var(--color-slate-100));

    border-radius: var(--radius-lg) var(--radius-lg);

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

  ul > :global(li:not(.xs) > *) {
    padding-block: calc(var(--spacing) * 3);
    padding-inline: calc(var(--spacing) * 3.5);

    @media screen and (min-width: 40rem) {
      padding-block: calc(var(--spacing) * 3);
      padding-inline: calc(var(--spacing) * 4);
    }
  }

  ul > :global(li.xs > *) {
    padding-block: calc(var(--spacing) * 0.5);
    padding-block: calc(var(--spacing) * 1);
  }

  ul > :global(li.selected) {
    background-color: color-mix(
      in oklab,
      var(--color-white),
      var(--color-slate-50)
    );
  }

  :global(.dark) ul > :global(li.selected) {
    background-color: color-mix(
      in oklab,
      var(--color-zinc-900) 90%,
      var(--color-zinc-800)
    );
  }

  :global(.dark) ul > :global(li) {
    border: 1px solid var(--color-zinc-900);
    background-color: color-mix(
      in oklab,
      var(--color-zinc-925),
      var(--color-zinc-900)
    );

    &:hover {
      background-color: var(--color-zinc-900);
    }

    &:active {
      background-color: color-mix(
        in oklab,
        var(--color-zinc-900) 80%,
        var(--color-zinc-925)
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
