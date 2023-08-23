<script lang="ts">
  import ModlogItem from './ModlogItem.svelte'

  export let data
</script>

<div class="flex flex-col gap-4">
  <h1 class="font-bold text-2xl">Modlog</h1>
  {#if data.modlog}
    <ul class="flex flex-col gap-4">
      {#each data.modlog as modlog}
        <ModlogItem item={modlog} />
      {/each}
    </ul>
  {/if}
</div>
