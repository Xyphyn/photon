<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MultiSelect from '$lib/components/input/Switch.svelte'
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <MultiSelect
    headless
    options={['/profile/user', '/profile/settings', '/profile/blocks']}
    optionNames={['User', 'Settings', 'Blocks']}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
