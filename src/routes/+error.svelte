<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/Link.svelte'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-3xl">{$page.status}</h1>
  <p class="mx-4 md:mx-8">
    Failed to fetch page. The lemmy servers are having quite a lot of issues
    right now, this is likely on their end.
  </p>
  <code class="bg-zinc-800 px-2 py-1 rounded-md">
    {JSON.stringify($page.error)}
  </code>
  <Link href={$page.url.toString()}>Retry</Link>
</div>
