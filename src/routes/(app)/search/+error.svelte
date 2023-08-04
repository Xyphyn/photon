<script>
  import { page } from '$app/stores'
</script>

<div class="text-center">
  <h1 class="text-4xl font-black">{$page.status}</h1>
  <span>The search timed out. This is an issue on the server's side.</span>
</div>
