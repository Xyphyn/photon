<script lang="ts">
  import RemoveModal from '$lib/components/lemmy/moderation/RemoveModal.svelte'
  import { modals } from '$lib/components/lemmy/moderation/moderation.js'
  import ReportModal from './ReportModal.svelte'
</script>

<ReportModal bind:open={$modals.reporting.open} item={$modals.reporting.item} />
<RemoveModal bind:open={$modals.removing.open} item={$modals.removing.item} />
