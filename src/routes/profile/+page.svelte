<script lang="ts">
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/i18n/translations.js'
</script>

<Header pageHeader>
  {$t('profile.profile')}
</Header>
