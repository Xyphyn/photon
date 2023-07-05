<script lang="ts">
  import InboxItem from './InboxItem.svelte'

  export let data
</script>

<svelte:head>
  <title>Inbox</title>
</svelte:head>

<h1 class="font-bold text-3xl">Inbox</h1>
<div class="flex flex-col gap-4 list-none my-4">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <p class="text-center opacity-60 text-lg mx-4">
      Wow, it's quite empty in here.
    </p>
  {:else}
    {#each data.data as item}
      <InboxItem {item} />
    {/each}
  {/if}
</div>
