<script lang="ts">
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'

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
