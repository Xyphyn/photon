<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { profile } from '$lib/auth'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import { Badge } from 'mono-svelte'
</script>

{#if ($profile?.user?.notifications.applications ?? 0) > 0}
  <span class="flex flex-row text-red-500 gap-2">
    <Badge color="red-subtle" class="w-max">
      {$profile?.user?.notifications.applications}
    </Badge> unread applications
  </span>
{/if}

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    headless
    options={[
      '/admin/config',
      '/admin/applications',
      '/admin/taglines',
      '/admin/team',
      '/admin/federation',
    ]}
    optionNames={[
      'Configuration',
      'Applications',
      'Taglines',
      'Team',
      'Federation',
    ]}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
