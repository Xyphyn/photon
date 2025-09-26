<script>
  import { notifications } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { Tabs } from '$lib/ui/layout'
  import { Badge } from 'mono-svelte'

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
  />
  {@render children?.()}
</div>
