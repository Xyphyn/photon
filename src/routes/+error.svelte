<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { t } from '$lib/translations'
  import { Button } from 'mono-svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
</script>

<div class="flex flex-col gap-4 mx-auto my-auto h-full justify-center">
  <h1 class="text-red-500 text-4xl font-black flex items-center flex-row gap-2">
    <div
      class="rounded-full bg-red-500 text-red-100 dark:text-red-900 p-1 w-max"
    >
      <Icon src={XMark} mini size="24" />
    </div>
    {$page.status}
  </h1>
  <code class="rounded-md dark:!bg-zinc-950 px-2 py-1 min-w-48">
    {$page.error?.message}
  </code>
  <Button size="sm" class="w-max" on:click={() => goto($page.url)}>
    {$t('message.retry')}
  </Button>
</div>
