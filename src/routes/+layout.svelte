<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  import { onMount } from 'svelte'
  // @ts-ignore
  import { pwaInfo } from 'virtual:pwa-info'
  import PwaReload from '$lib/PwaReload.svelte'

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

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
  {@html webManifest}
</svelte:head>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <ToastContainer />
  <Moderation />
  <div
    class="flex flex-row h-full w-full max-w-full sm:divide-x dark:divide-zinc-900
    divide-slate-200 flex-1"
  >
    <Sidebar />
    <main
      class="p-3 sm:p-6 min-w-0 w-full flex-[3] sm:rounded-tl-lg
      border-slate-200 dark:border-zinc-900 border-t"
    >
      <slot />
    </main>
  </div>
</div>
