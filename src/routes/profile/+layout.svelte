<script>
  import { t } from '$lib/app/i18n'
  import { Tabs } from '$lib/ui/layout'

  let { children } = $props()
</script>

<svelte:head>
  <title>{$t('profile.profile')}</title>
</svelte:head>

<Tabs
  routes={[
    {
      href: '/profile/user',
      name: $t('routes.profile.submissions'),
    },
    {
      href: '/profile/settings',
      name: $t('routes.profile.edit'),
    },
    {
      href: '/profile/blocks',
      name: $t('routes.profile.blocks.title'),
    },
    {
      href: '/profile/password',
      name: $t('routes.profile.credentials'),
    },
    {
      href: '/profile/media',
      name: $t('routes.profile.media.title'),
    },
  ]}
/>
{@render children?.()}
