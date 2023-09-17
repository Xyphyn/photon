<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MultiSelect from '$lib/components/input/Switch.svelte'
</script>

<MultiSelect
  headless
  options={[
    '/util',
    '/util/photonify',
    '/util/placeholder',
    '/util/constants',
    '/util/functions',
  ]}
  optionNames={[
    'Home',
    'Photonify links',
    'Placeholders',
    'Constants',
    'Functions',
  ]}
  selected={$page.url.pathname}
  on:select={(e) => {
    goto(e.detail)
  }}
/>
<div class="mt-4 flex flex-col gap-2">
  <slot />
</div>
