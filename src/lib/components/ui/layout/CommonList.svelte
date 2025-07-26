<script lang="ts" generics="T">
  import type { Snippet } from 'svelte'

  interface Props {
    items?: T[]
    item?: Snippet<[T, number]>
    children?: Snippet
  }

  let { items, item: itemSnippet, children }: Props = $props()
</script>

<ul class="divide-y-3 divide-slate-25 dark:divide-zinc-925">
  {#if items}
    {#each items as item, index (item)}
      <li class="@container group/li">
        {@render itemSnippet?.(item, index)}
      </li>
    {/each}
  {/if}
  {@render children?.()}
</ul>

<style>
  ul > :global(li) {
    padding-block: calc(var(--spacing) * 2);
    padding-inline: calc(var(--spacing) * 3);
    transition: background-color 0.1s;
    background-color: var(--color-slate-50);
    container-type: inline-size;

    &:first-child {
      border-top-left-radius: var(--radius-2xl);
      border-top-right-radius: var(--radius-2xl);
    }
    &:last-child {
      border-bottom-left-radius: var(--radius-2xl);
      border-bottom-right-radius: var(--radius-2xl);
    }

    &:hover {
      background-color: var(--color-zinc-50);
    }
  }

  @media screen and (min-width: 40rem) {
    ul > :global(li) {
      padding-block: calc(var(--spacing) * 2);
      padding-inline: calc(var(--spacing) * 3);
    }
  }

  :global(.dark) ul > :global(li) {
    background-color: var(--color-zinc-950);

    &:hover {
      background-color: var(--color-zinc-900);
    }
  }
</style>
