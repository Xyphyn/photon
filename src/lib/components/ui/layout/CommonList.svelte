<script lang="ts" generics="T">
  import type { Snippet } from 'svelte'

  interface Props {
    items: T[]
    item: Snippet<[T, number]>
  }

  let { items, item: itemSnippet }: Props = $props()
</script>

<ul class="divide-y-3 divide-slate-25 dark:divide-zinc-925">
  {#each items as item, index (item)}
    <li
      class={[
        'py-2 px-3 sm:py-3 sm:px-4',
        'hover:bg-slate-100 dark:hover:bg-zinc-900/25 transition-colors @container',
        'bg-slate-50 dark:bg-zinc-950 first:rounded-t-2xl last:rounded-b-2xl group/li',
      ]}
    >
      {@render itemSnippet(item, index)}
    </li>
  {/each}
</ul>
