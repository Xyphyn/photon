<script lang="ts">
  import { modals } from '$lib/components/lemmy/moderation/moderation.js'
</script>

<!--These weird await hacks are for lazy loading, better network performance-->
{#if $modals.reporting.open}
  {#await import('$lib/components/lemmy/moderation/ReportModal.svelte') then { default: ReportModal }}
    <ReportModal
      bind:open={$modals.reporting.open}
      bind:item={$modals.reporting.item}
    />
  {/await}
{/if}
{#if $modals.removing.open}
  {#await import('$lib/components/lemmy/moderation/RemoveModal.svelte') then { default: RemoveModal }}
    <RemoveModal
      bind:open={$modals.removing.open}
      item={$modals.removing.item}
      purge={$modals.removing.purge}
    />
  {/await}
{/if}
{#if $modals.banning.open}
  {#await import('$lib/components/lemmy/moderation/BanModal.svelte') then { default: BanModal }}
    <BanModal
      bind:open={$modals.banning.open}
      banned={$modals.banning.banned}
      user={$modals.banning.user}
      community={$modals.banning.community}
    />
  {/await}
{/if}
