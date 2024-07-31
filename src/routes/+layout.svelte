<script lang="ts">
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte'
  import '../style/app.css'
  import { navigating, page } from '$app/stores'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  // @ts-ignore
  import { pwaInfo } from 'virtual:pwa-info'
  import {
    colorScheme,
    inDarkColorScheme,
    rgbToHex,
    theme,
    themeVars,
  } from '$lib/ui/colors.js'
  import { userSettings } from '$lib/settings.js'
  import { Button, ModalContainer, Spinner, ToastContainer } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { Forward, Icon } from 'svelte-hero-icons'
  import { routes } from '$lib/util.js'
  import Shell from '$lib/components/ui/layout/Shell.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { site } from '$lib/lemmy.js'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance'
  import { locale } from '$lib/translations'
  import { getDefaultColors } from '$lib/ui/presets'

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    easing: 'ease-out',
    speed: 300,
    showSpinner: false,
  })

  let barTimeout: any = 0

  $: {
    if (browser) {
      if ($navigating) {
        document.body.classList.toggle('wait', true)
        barTimeout = setTimeout(() => nProgress.start(), 100)
      }
      if (!$navigating) {
        document.body.classList.toggle('wait', false)
        clearTimeout(barTimeout)
        nProgress.done()
      }
    }
  }

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

  onMount(() => {
    if (browser) {
      if (window.location.hash == 'main') {
        history.replaceState(
          null,
          '',
          window.location.toString().replace('#main', '')
        )
      }
      document.body.querySelector('.loader')?.classList.add('hidden')
      themeVars.subscribe((vars) => {
        document.body.setAttribute('style', vars)
      })
      userSettings.subscribe((settings) => {
        document.body.classList.remove(
          'font-display',
          'font-inter',
          'font-sans',
          'font-system',
          'font-nunito'
        )
        document.body.classList.add(
          settings.font == 'inter'
            ? 'font-inter'
            : $userSettings.font == 'system'
              ? 'font-system'
              : $userSettings.font == 'satoshi/nunito'
                ? 'font-nunito'
                : 'font-sans'
        )
      })
    }
  })
  $: title = routes[($page.route.id as keyof typeof routes) ?? '']
</script>

<svelte:head>
  {#if $site?.site_view}
    <title>{$site?.site_view.site.name}</title>
    <meta
      name="theme-color"
      content={rgbToHex(
        $colorScheme && inDarkColorScheme()
          ? $theme.colors.zinc?.[925] ?? getDefaultColors().zinc[925]
          : $theme.colors.slate?.[25] ?? getDefaultColors().slate[25]
      )}
    />
    {#if LINKED_INSTANCE_URL}
      <link rel="icon" href={$site?.site_view?.site.icon} />
      <meta name="description" content={$site?.site_view?.site.description} />
    {:else}
      <meta name="description" content="A sleek client for Lemmy" />
    {/if}
  {/if}
  {@html webManifest}
</svelte:head>

<Button
  class="fixed -top-16 focus:top-0 left-0 m-4 z-[300] transition-all"
  href="#main"
>
  <Icon src={Forward} mini size="16" slot="prefix" />
  Skip Navigation
</Button>
<Shell
  dir={$locale == 'he' && $userSettings.useRtl ? 'rtl' : 'ltr'}
  class="min-h-screen "
  route={$page.route}
>
  <Moderation />
  <ToastContainer />
  <ExpandableImage />
  <ModalContainer />

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
    class="p-4 sm:p-6 min-w-0 w-full flex flex-col h-full relative {c}"
    style={s}
    class:max-w-6xl={$userSettings.newWidth}
    id="main"
  >
    <slot />
  </main>
  <Navbar
    slot="navbar"
    let:style={s}
    let:class={c}
    class={c}
    style={s}
    {title}
  />
  <div slot="suffix" let:class={c} let:style={s} class={c} style={s}>
    {#if $page.data.slots?.sidebar?.component}
      <svelte:component
        this={$page.data.slots.sidebar.component}
        {...$page.data.slots.sidebar.props}
      />
    {:else if $site}
      <SiteCard
        site={$site.site_view}
        taglines={$site.taglines}
        admins={$site.admins}
        version={$site.version}
        class=""
      />
    {:else}
      <div class="h-64 w-full grid place-items-center">
        <Spinner width={32} />
      </div>
    {/if}
  </div>
</Shell>
