<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Tabs } from '$lib/ui/layout'

  let { children } = $props()
</script>

<svelte:head>
  <title>{$t('routes.moderation.title')}</title>
</svelte:head>

<Tabs
  routes={[
    {
      href: '/moderation',
      name: $t('routes.moderation.feed'),
    },
    {
      href: '/moderation/communities',
      name: $t('routes.communities.title'),
    },
  ]}
/>
{@render children?.()}
