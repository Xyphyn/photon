<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-3xl">404</h1>
  <p class="mx-4 md:mx-8">
    It's likely that this community hasn't been federated (nobody on your
    instance has subscribed to it yet.)
  </p>
  <Button on:click={() => goto($page.url)}>Retry</Button>
</div>
