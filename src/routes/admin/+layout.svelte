<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { _ } from 'svelte-i18n'
</script>

<svelte:head>
  <title>{$_('page.admin.admin')}</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    headless
    options={[
      '/admin/config',
      '/admin/applications',
      '/admin/taglines',
      '/admin/team',
    ]}
    optionNames={['Configuration', 'Applications', 'Taglines', 'Team']}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
