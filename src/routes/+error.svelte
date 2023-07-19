<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import { corsSupported } from '$lib/lemmy.js'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-5xl">{$page.status}</h1>
  <Button href={$page.url.toString()}>Retry</Button>
  <Button
    on:click={() => {
      corsSupported.set(false)
      goto($page.url.toString())
    }}
  >
    Retry through proxy
  </Button>
</div>
