<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="flex flex-col mx-auto gap-4 justify-center items-center">
  <h1 class="font-black text-3xl">{$page.status}</h1>
  <p>{JSON.stringify($page.error)}</p>
</div>
