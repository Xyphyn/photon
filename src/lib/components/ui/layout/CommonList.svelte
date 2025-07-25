<script lang="ts" generics="T">
  import type { Snippet } from 'svelte'

  interface Props {
    items: T[]
    item: Snippet<[T, number]>
  }

  let { items, item: itemSnippet }: Props = $props()
</script>

<ul class="divide-y">
  {#each items as item, index}
    <li
      class={[
        'py-3 px-4',
        'hover:bg-slate-100 dark:hover:bg-zinc-900/25 transition-colors',
        '@container border-slate-100 dark:border-zinc-900',
        'bg-slate-50 dark:bg-zinc-950 first:rounded-t-2xl last:rounded-b-2xl',
      ]}
    >
      {@render itemSnippet(item, index)}
    </li>
  {/each}
</ul>
