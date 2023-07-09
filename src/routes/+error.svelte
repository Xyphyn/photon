<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import { corsSupported } from '$lib/lemmy.js'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-3xl">{$page.status}</h1>
  <p class="mx-4 md:mx-8">
    Failed to fetch page. Most major lemmy instances are having quite a lot of
    issues right now, this might be on their end.
  </p>
  <p>
    This could be a CORS issue. The instance you're using must update to Lemmy
    1.18.1 to fix CORS.
  </p>
  <code class="bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
    {JSON.stringify($page.error)}
  </code>
  <Link href={$page.url.toString()}>Retry</Link>
  <Button
    on:click={() => {
      corsSupported.set(false)
      goto($page.url.toString())
    }}
  >
    Retry through proxy
  </Button>
</div>
