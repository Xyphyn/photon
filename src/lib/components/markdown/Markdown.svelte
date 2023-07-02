<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'

  export let source: string
</script>

<SvelteMarkdown {source} />
