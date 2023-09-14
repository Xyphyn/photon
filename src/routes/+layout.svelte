<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  // @ts-ignore
  import { pwaInfo } from 'virtual:pwa-info'
  import { inDarkTheme } from '$lib/ui/colors.js'
  import { userSettings } from '$lib/settings.js'
  import { ToastContainer } from 'mono-svelte'

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
  <meta name="theme-color" content={inDarkTheme() ? '#020202' : '#f1f6f9'} />
  {@html webManifest}
</svelte:head>

<div
  class="flex flex-col min-h-screen
  font-inter
  {$userSettings.font == 'inter'
    ? 'font-inter'
    : $userSettings.font == 'system'
    ? 'font-system'
    : 'font-sans'}
  "
>
  <Navbar />
  <ToastContainer />
  <Moderation />
  <div class="flex flex-row h-full w-full max-w-full flex-1">
    <Sidebar />
    <main
      class="p-3 sm:p-6 min-w-0 w-full flex-[3] sm:rounded-tl-lg
      border-slate-200 dark:border-zinc-900 sm:border-l border-t bg-slate-25 dark:bg-zinc-950"
    >
      <slot />
    </main>
  </div>
</div>
