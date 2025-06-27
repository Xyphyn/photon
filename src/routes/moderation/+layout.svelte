<script lang="ts">
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'

  let { children } = $props()
</script>

<svelte:head>
  <title>{$t('routes.moderation.title')}</title>
</svelte:head>

<div class="w-full space-y-4 pb-8">
  <div
    class="sticky w-max mx-auto z-50 max-w-full min-w-0 flex items-center gap-2 top-6 lg:top-22"
  >
    <Tabs
      class="overflow-auto"
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
  </div>
  {@render children?.()}
</div>
