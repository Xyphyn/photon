<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import ToastContainer from '$lib/components/ui/toasts/ToastContainer.svelte'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import Sidebar from '$lib/components/ui/Sidebar.svelte'
  import { onMount } from 'svelte'
  // @ts-ignore
  import { pwaInfo } from 'virtual:pwa-info'

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

  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegistered(r) {
          console.log(`SW Registered: ${r}`)
          r?.update()
        },
        onRegisterError(error) {
          console.log('SW registration error', error)
        },
      })
    }
  })

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

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
      class="p-3 lg:p-6 min-w-0 w-full flex-[3] sm:rounded-tl-lg
      border-slate-200 dark:border-zinc-900 border-t"
    >
      <slot />
    </main>
  </div>
</div>
