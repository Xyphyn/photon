<script lang="ts">
  import Placeholder from '$comp/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { Key } from 'svelte-hero-icons'
</script>

<div class="h-full grid place-items-center">
  <Placeholder
    icon={Key}
    title={$t('form.profile.credentials.title')}
    description={$t('form.profile.credentials.description')}
  />
</div>
