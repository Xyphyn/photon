<script lang="ts">
  import { modals } from './moderation'
</script>

<!--These weird await hacks are for lazy loading, better network performance-->
{#if $modals.reporting.open}
  {#await import('./ReportModal.svelte') then { default: ReportModal }}
    <ReportModal
      bind:open={$modals.reporting.open}
      bind:item={$modals.reporting.item}
    />
  {/await}
{/if}
{#if $modals.removing.open}
  {#await import('./RemoveModal.svelte') then { default: RemoveModal }}
    <RemoveModal
      bind:open={$modals.removing.open}
      item={$modals.removing.item}
      purge={$modals.removing.purge}
    />
  {/await}
{/if}
{#if $modals.banning.open}
  {#await import('./BanModal.svelte') then { default: BanModal }}
    <BanModal
      bind:open={$modals.banning.open}
      banned={$modals.banning.banned}
      user={$modals.banning.user}
      community={$modals.banning.community}
    />
  {/await}
{/if}

{#if $modals.votes.open}
  {#await import('./ViewVotesModal.svelte') then { default: VotesModal }}
    <VotesModal bind:open={$modals.votes.open} item={$modals.votes.item} />
  {/await}
{/if}
