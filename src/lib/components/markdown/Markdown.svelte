<script lang="ts">
  import MarkdownHeader from '$lib/components/markdown/MarkdownHeader.svelte'
  import MarkdownLink from '$lib/components/markdown/MarkdownLink.svelte'
  import SvelteMarkdown from 'svelte-markdown'

  export let source: string | undefined
</script>

<SvelteMarkdown
  {source}
  renderers={{
    link: MarkdownLink,
    heading: MarkdownHeader,
  }}
/>
