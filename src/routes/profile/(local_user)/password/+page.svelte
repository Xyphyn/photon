<script lang="ts">
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { t } from '$lib/app/i18n/index.js'
  import { Key } from 'svelte-hero-icons'
</script>

<div class="h-full grid place-items-center">
  <Placeholder
    icon={Key}
    title={$t('form.profile.credentials.title')}
    description={$t('form.profile.credentials.description')}
  />
</div>
