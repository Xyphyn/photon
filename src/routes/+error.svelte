<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-5xl">{$page.status}</h1>
  <p>Failed to fetch that page. Is it missing?</p>
  <Button href={$page.url.toString()}>Retry</Button>
</div>
