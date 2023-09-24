<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import '../style/app.css'
  import { navigating, page } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  // @ts-ignore
  import { pwaInfo } from 'virtual:pwa-info'
  import { inDarkTheme, theme } from '$lib/ui/colors.js'
  import { userSettings } from '$lib/settings.js'
  import { Button, ToastContainer } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { Forward, Icon } from 'svelte-hero-icons'
  import { DEFAULT_INSTANCE_URL, instance } from '$lib/instance.js'
  import { routes } from '$lib/util.js'

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
  $: darkTheme = $theme && inDarkTheme()

  onMount(() => {
    if (browser) {
      if (window.location.hash == 'main') {
        history.replaceState(
          null,
          '',
          window.location.toString().replace('#main', '')
        )
      }
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          darkTheme = inDarkTheme()
        })
    }
  })

  $: title = routes[($page.route.id as keyof typeof routes) ?? '']
</script>

<svelte:head>
  <meta name="theme-color" content={darkTheme ? '#020202' : '#f6f9fb'} />
  {@html webManifest}
</svelte:head>

<Button
  class="fixed -top-16 focus:top-0 left-0 m-4 z-[300] transition-all"
  href="#main"
>
  <Icon src={Forward} mini size="16" slot="prefix" />
  Skip Navigation
</Button>

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
  <Navbar {title} />
  <ToastContainer />
  <Moderation />
  <div
    class="flex flex-row h-full w-full max-w-full flex-1
  "
  >
    <Sidebar />
    <div
      class="w-full border-t sm:border-l border-slate-200 dark:border-zinc-900
    sm:rounded-xl bg-slate-25 dark:bg-zinc-950"
    >
      <main
        class="p-3 sm:p-6 min-w-0 w-full flex-[3] sm:rounded-tl-lg mx-auto
      "
        class:max-w-6xl={$userSettings.newWidth}
        id="main"
      >
        <slot />
      </main>
    </div>
  </div>
</div>
