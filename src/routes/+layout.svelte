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
  import { inDarkTheme, theme } from '$lib/ui/colors.js'
  import { userSettings } from '$lib/settings.js'
  import { ToastContainer } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import Gradient from '$lib/components/ui/Gradient.svelte'

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
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          darkTheme = inDarkTheme()
        })
    }
  })
</script>

<svelte:head>
  <meta name="theme-color" content={darkTheme ? '#020202' : '#f6f9fb'} />
  {@html webManifest}
</svelte:head>

<div
  class="main-container min-h-screen
  {$userSettings.font == 'inter'
    ? 'font-inter'
    : $userSettings.font == 'system'
    ? 'font-system'
    : 'font-sans'}
  "
>
  {#if $userSettings.glow}
    <Gradient />
  {/if}
  <Navbar />
  <Sidebar class="z-0 w-full min-w-0 sticky" />
  <ToastContainer />
  <Moderation />
  <main
    style="grid-area: c;"
    class="p-3 sm:p-6 sm:rounded-l-lg max-w-full min-w-0
      border-slate-200 dark:border-zinc-900 sm:border-l border-t bg-slate-25 dark:bg-zinc-950
      h-full place-self-stretch"
  >
    <slot />
  </main>
</div>

<style>
  .main-container {
    display: grid;
    grid-template-columns: minmax(min-content, auto) 3fr;
    grid-template-areas:
      'a a'
      'b c';
    place-items: start;
  }

  @media (min-width: 640px) {
    .main-container {
      grid-template-columns: minmax(auto-fit, 1fr) 1fr;
      grid-template-rows: max-content;
    }
  }
</style>
