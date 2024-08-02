<script lang="ts">
  import { marked } from 'marked'
  import SvelteMarkdown from 'svelte-markdown'
  import { options, renderers } from '../Markdown.svelte'
  import { Disclosure } from 'mono-svelte'
  import { Icon } from 'svelte-hero-icons'
  import Expandable from '$lib/components/ui/Expandable.svelte'

  export let raw: string

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

  $: data = extractTitle(raw)
</script>

<Expandable class="border-y border-slate-200 dark:border-zinc-800 py-2">
  <div slot="title" class="text-left">
    <SvelteMarkdown source={data.title} {renderers} {options} isInline />
  </div>
  <SvelteMarkdown source={data.content} {renderers} {options} />
</Expandable>
