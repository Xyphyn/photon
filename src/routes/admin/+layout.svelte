<script>
  import { notifications } from '$lib/auth.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import {} from '$lib/components/ui/layout/Shell.svelte'
  import { t } from '$lib/i18n/translations'
  import { Badge } from 'mono-svelte'
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props()
</script>

{#if $notifications.applications > 0}
  <span class="flex flex-row text-red-500 gap-2">
    <Badge color="red-subtle" class="w-max">
      {$notifications.applications > 99 ? '∞' : $notifications.applications}
    </Badge> unread applications
  </span>
{/if}

<div class="flex flex-col gap-4 h-full">
  <div
    class="sticky mx-auto z-50 max-w-full min-w-0 flex items-center gap-2
    top-6 lg:top-22"
  >
    <Tabs
      routes={[
        {
          href: '/admin/config',
          name: $t('routes.admin.config.title'),
        },
        {
          href: '/admin/applications',
          name: $t('routes.admin.applications.title'),
        },
        {
          href: '/admin/taglines',
          name: $t('routes.admin.taglines.title'),
        },
        {
          href: '/admin/team',
          name: $t('routes.admin.team.title'),
        },
        {
          href: '/admin/federation',
          name: $t('routes.admin.federation.title'),
        },
        {
          href: '/admin/media',
          name: $t('routes.admin.media.title'),
        },
      ]}
      class="overflow-auto"
    />
  </div>
  {@render children?.()}
</div>
