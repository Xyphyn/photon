<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from 'mono-svelte'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center h-full">
  <h1 class="font-black text-5xl">{$page.status}</h1>
  <p>Failed to fetch that page.</p>
  <code>{$page.error?.message}</code>
  <Button href={$page.url.toString()}>Retry</Button>
</div>
