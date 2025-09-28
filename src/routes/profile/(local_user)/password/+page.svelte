<script lang="ts">
  import { t } from '$lib/app/i18n'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Key } from 'svelte-hero-icons/dist'
</script>

<div class="h-full grid place-items-center">
  <Placeholder
    icon={Key}
    title={$t('form.profile.credentials.title')}
    description={$t('form.profile.credentials.description')}
  />
</div>
