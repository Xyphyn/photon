<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { Button } from 'mono-svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
</script>

<div
  class="flex flex-col gap-2 mx-auto my-auto items-center h-full justify-center"
>
  <div
    class="rounded-full bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 w-max"
  >
    <Icon src={XMark} size="32" mini />
  </div>
  <h1 class="text-red-800 dark:text-red-300 text-4xl font-black">
    {$page.status}
  </h1>
  <p class="text-red-800 dark:text-red-300">Failed to fetch that page.</p>
  <code>{$page.error?.message}</code>
  <Button on:click={() => goto($page.url)}>Retry</Button>
</div>
