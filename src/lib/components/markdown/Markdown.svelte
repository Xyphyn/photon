<script lang="ts">
  import MarkdownLink from '$lib/components/markdown/MarkdownLink.svelte'
  import SvelteMarkdown from 'svelte-markdown'

  export let source: string | undefined
</script>

<SvelteMarkdown
  {source}
  renderers={{
    link: MarkdownLink,
  }}
/>
