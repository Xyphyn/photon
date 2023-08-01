<script lang="ts">
  import BanModal from '$lib/components/lemmy/moderation/BanModal.svelte'
  import RemoveModal from '$lib/components/lemmy/moderation/RemoveModal.svelte'
  import { modals } from '$lib/components/lemmy/moderation/moderation.js'
  import ReportModal from './ReportModal.svelte'
</script>

<ReportModal bind:open={$modals.reporting.open} item={$modals.reporting.item} />
<RemoveModal bind:open={$modals.removing.open} item={$modals.removing.item} />
<BanModal
  bind:open={$modals.banning.open}
  banned={$modals.banning.banned}
  user={$modals.banning.user}
  community={$modals.banning.community}
/>
