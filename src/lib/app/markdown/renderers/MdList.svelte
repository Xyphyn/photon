<script lang="ts">
  interface Props {
    ordered: boolean
    start: number
    children?: import('svelte').Snippet
  }

  let { ordered, start, children }: Props = $props()
</script>

{#if ordered}
  <ol {start} class="ps-5 list-decimal">
    {@render children?.()}
  </ol>
{:else}
  <ul class="list-disc ps-8 *:marker:content-['• ']!">
    {@render children?.()}
  </ul>
{/if}
