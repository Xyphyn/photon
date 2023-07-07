<script lang="ts">
  import MarkdownHeader from '$lib/components/markdown/MarkdownHeader.svelte'
  import MarkdownHr from '$lib/components/markdown/MarkdownHr.svelte'
  import MarkdownLink from '$lib/components/markdown/MarkdownLink.svelte'
  import MarkdownQuote from '$lib/components/markdown/MarkdownQuote.svelte'
  import SvelteMarkdown from 'svelte-markdown'

  export let source: string | undefined
</script>

<div class="break-words">
  <SvelteMarkdown
    {source}
    renderers={{
      link: MarkdownLink,
      heading: MarkdownHeader,
      hr: MarkdownHr,
      blockquote: MarkdownQuote,
    }}
  />
</div>
