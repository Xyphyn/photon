<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte'
  import '../style/app.css'
  import { navigating, page } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    showSpinner: false,
  })

  $: {
    if ($navigating) {
      nProgress.start()
    }
    if (!$navigating) {
      nProgress.done()
    }
  }

  export let data
</script>

<Navbar instance_url={data.instance_url} />
<div class="mx-auto max-w-5xl p-4">
  <slot />
</div>
