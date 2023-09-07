<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MultiSelect from '$lib/components/input/Switch.svelte'
</script>

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
