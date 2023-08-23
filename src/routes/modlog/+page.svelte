<script lang="ts">
  import ModlogItem from './ModlogItem.svelte'

  export let data
</script>

<div class="flex flex-col gap-4">
  <h1 class="font-bold text-2xl">Modlog</h1>
  {#if data.modlog}
    <table class="table border-collapse">
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead class="text-left">
        <tr>
          <th>Action</th>
          <th>Moderator</th>
          <th>Moderatee</th>
          <th>Community</th>
          <th>Link</th>
        </tr>
      </thead>
      {#each data.modlog as modlog}
        <ModlogItem item={modlog} />
      {/each}
    </table>
  {/if}
</div>

<style lang="postcss">
  :global(.table thead tr th) {
    @apply border border-slate-200 dark:border-zinc-800 px-4 py-2;
  }

  :global(.table tr td) {
    @apply border border-slate-200 px-4 py-2 overflow-auto;
  }

  :global(.dark .table tr td) {
    @apply border-zinc-800;
  }

  :global(.dark thead tr th) {
    @apply border-zinc-800;
  }
</style>
