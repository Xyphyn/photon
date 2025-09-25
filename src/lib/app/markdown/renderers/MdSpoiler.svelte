<script lang="ts">
  import Expandable from 'mono-svelte/disclosure/Expandable.svelte'
  import type { Snippet } from 'svelte'

  interface Props {
    raw: string
    children?: Snippet
  }

  let { raw, children }: Props = $props()

  function extractTitle(text: string) {
    const spoilerRegex = /^::: ?spoiler (.+)\n([\s\S]+?)\n:::/gm

    const result = spoilerRegex.exec(text)

    if (!result?.[1] || !result?.[2])
      return {
        title: 'parsing error',
        content: 'parsing error',
      }

    return {
      title: result[1],
      content: result[2],
    }
  }

  let data = $derived(extractTitle(raw))
</script>

<Expandable class="border-y border-slate-200 dark:border-zinc-800 py-2">
  {#snippet title()}
    <div class="text-left">
      {data.title}
    </div>
  {/snippet}
  {@render children?.()}
</Expandable>
