<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
</script>

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    headless
    options={['/admin/config', '/admin/applications', '/admin/taglines']}
    optionNames={['Configuration', 'Applications', 'Taglines']}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
