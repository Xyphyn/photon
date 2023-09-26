<script>
  import { page } from '$app/stores'
  import { XMark, Icon } from 'svelte-hero-icons'
</script>

<div class="flex flex-col items-center h-max my-auto gap-2">
  <div
    class="rounded-full bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-300 p-3"
  >
    <Icon src={XMark} size="32" mini />
  </div>
  <h1 class="text-red-800 dark:text-red-300 text-2xl font-semibold">Error</h1>
  <p class="text-red-800 dark:text-red-300">
    That password reset token doesn't exist.
  </p>
  <code>{$page.error?.message}</code>
</div>
