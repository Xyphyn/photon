<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import { userSettings } from '$lib/settings.js'

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    showSpinner: false,
  })

  $: {
    if ($navigating) {
      if (typeof document != 'undefined') {
        nProgress.start()
        document?.documentElement?.classList?.toggle('wait', true)
      }
    }
    if (!$navigating) {
      if (typeof document != 'undefined') {
        nProgress.done()
        document?.documentElement?.classList?.toggle('wait', false)
      }
    }
  }
</script>

<Navbar />
<ToastContainer />
<Moderation />
<div
  class="flex flex-row w-full mx-auto"
  class:max-w-full={$userSettings.fullWidthLayout}
  class:max-w-5xl={!$userSettings.fullWidthLayout}
>
  <main class="p-4 flex-[3] max-w-full">
    <slot />
  </main>
</div>
