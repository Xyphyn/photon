<script lang="ts">
  export let ordered: boolean
  export let start: number
</script>

{#if ordered}
  <ol {start} class="list-decimal pl-3"><slot /></ol>
{:else}
  <ul class="list-disc pl-3"><slot /></ul>
{/if}
