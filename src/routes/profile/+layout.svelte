<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { t } from '$lib/translations'
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full z-0">
  <MultiSelect
    options={[
      '/profile/user',
      '/profile/settings',
      '/profile/blocks',
      '/profile/password',
    ]}
    optionNames={[
      $t('routes.profile.user'),
      $t('routes.profile.settings'),
      $t('routes.profile.blocks'),
      $t('routes.profile.credentials'),
    ]}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
