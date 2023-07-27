<script lang="ts">
  import { modals } from '$lib/components/lemmy/moderation/moderation.js'
  import ReportModal from './ReportModal.svelte'
</script>

<ReportModal bind:open={$modals.reporting.open} item={$modals.reporting.item} />
