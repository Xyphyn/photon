<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating, page } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    showSpinner: false,
  })

  $: {
    if ($navigating) {
      nProgress.start()
      if (typeof document != 'undefined') {
        document.documentElement.classList.toggle('wait', true)
      }
    }
    if (!$navigating) {
      nProgress.done()
      if (typeof document != 'undefined') {
        document.documentElement.classList.toggle('wait', false)
      }
    }
  }
</script>

<Navbar />
<ToastContainer />
<div class="mx-auto max-w-5xl p-4 h-full">
  <slot />
</div>
