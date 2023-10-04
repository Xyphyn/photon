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
  import { Button, Spinner, ToastContainer } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { Forward, Icon } from 'svelte-hero-icons'
  import { routes } from '$lib/util.js'
  import Shell from '$lib/components/ui/layout/Shell.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { site } from '$lib/lemmy.js'

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
  <meta name="theme-color" content={darkTheme ? '#09090b' : '#f8fafc'} />
  {@html webManifest}
</svelte:head>

<Button
  class="fixed -top-16 focus:top-0 left-0 m-4 z-[300] transition-all"
  href="#main"
>
  <Icon src={Forward} mini size="16" slot="prefix" />
  Skip Navigation
</Button>

<Moderation />
<ToastContainer />

<Shell
  class="min-h-screen {$userSettings.font == 'inter'
    ? 'font-inter'
    : $userSettings.font == 'system'
    ? 'font-system'
    : 'font-sans'}"
  route={$page.route}
>
  <Navbar
    slot="navbar"
    let:style={s}
    let:class={c}
    class={c}
    style={s}
    {title}
  />
  <Sidebar
    route={$page.route.id ?? ''}
    slot="sidebar"
    let:style={s}
    let:class={c}
    class={c}
    style={s}
  />
  <main
    slot="main"
    let:style={s}
    let:class={c}
    class="p-3 sm:p-6 min-w-0 w-full flex flex-col min-h-full {c}"
    style={s}
    class:max-w-6xl={$userSettings.newWidth}
    id="main"
  >
    <slot />
  </main>
  <div slot="suffix" let:class={c} let:style={s} class={c} style={s}>
    {#if $site}
      <SiteCard
        site={$site.site_view}
        taglines={$site.taglines}
        admins={$site.admins}
        version={$site.version}
      />
    {:else}
      <div class="h-64 grid place-items-center">
        <Spinner width={32} />
      </div>
    {/if}
  </div>
</Shell>
