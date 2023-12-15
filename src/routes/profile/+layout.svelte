<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MultiSelect from '$lib/components/input/Switch.svelte'
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<div class="flex flex-col gap-4 h-full">
  <MultiSelect
    options={[
      '/profile/user',
      '/profile/settings',
      '/profile/blocks',
      '/profile/password',
    ]}
    optionNames={['User', 'Settings', 'Blocks', 'Credentials']}
    selected={$page.url.pathname}
    on:select={(e) => {
      goto(e.detail)
    }}
  />
  <slot />
</div>
