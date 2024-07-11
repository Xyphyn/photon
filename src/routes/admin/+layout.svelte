<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { notifications, profile } from '$lib/auth'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { t } from '$lib/translations'
  import { Badge } from 'mono-svelte'
</script>

{#if $notifications.applications > 0}
  <span class="flex flex-row text-red-500 gap-2">
    <Badge color="red-subtle" class="w-max">
      {$notifications.applications}
    </Badge> unread applications
  </span>
{/if}

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    options={[
      '/admin/config',
      '/admin/applications',
      '/admin/taglines',
      '/admin/team',
      '/admin/federation',
    ]}
    optionNames={[
      $t('routes.admin.config.title'),
      $t('routes.admin.applications.title'),
      $t('routes.admin.taglines.title'),
      $t('routes.admin.team.title'),
      $t('routes.admin.federation.title'),
    ]}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
