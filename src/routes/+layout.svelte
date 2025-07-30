<script lang="ts">
  import { browser } from '$app/environment'
  import { navigating, page } from '$app/state'
  import Moderation from '$lib/components/lemmy/moderation/Moderation.svelte'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import Shell from '$lib/components/ui/layout/Shell.svelte'
  import Navbar from '$lib/components/ui/navbar/Navbar.svelte'
  import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte'
  import { locale } from '$lib/i18n/translations'
  import { LINKED_INSTANCE_URL } from '$lib/instance.svelte'
  import { site } from '$lib/lemmy.svelte.js'
  import { settings } from '$lib/settings.svelte.js'
  import { inDarkColorScheme, rgbToHex, theme } from '$lib/ui/colors.svelte.js'
  import { getDefaultColors } from '$lib/ui/presets'
  import { Button, ModalContainer, Spinner, ToastContainer } from 'mono-svelte'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import { onMount } from 'svelte'
  import { Forward, Icon } from 'svelte-hero-icons'
  import '../style/app.css'
  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()

  nProgress.configure({
    minimum: 0.4,
    trickleSpeed: 200,
    easing: 'ease-out',
    speed: 300,
    showSpinner: false,
  })

  onMount(() => {
    if (browser) {
      if (window.location.hash == 'main') {
        history.replaceState(
          null,
          '',
          window.location.toString().replace('#main', ''),
        )
      }
      document.body.querySelector('.loader')?.classList.add('hidden')
    }
  })

  if (browser) {
    $effect(() => {
      if (settings) {
        document.documentElement.classList.remove(
          'font-inter',
          'font-sans',
          'font-system',
        )
        document.documentElement.classList.add(
          settings.font == 'inter'
            ? 'font-inter'
            : settings.font == 'system'
              ? 'font-system'
              : 'font-sans',
        )
      }
    })

    $effect(() => {
      document.documentElement.setAttribute('style', theme.vars)
    })

    $effect(() => {
      document.documentElement.dir =
        ($locale == 'he' || $locale == 'ar') && settings.useRtl ? 'rtl' : 'ltr'
    })
  }

  $effect(() => {
    if (navigating.to) nProgress.start()
    else nProgress.done()
  })
</script>

<svelte:head>
  {#if site.data?.site_view}
    <meta
      name="theme-color"
      content={rgbToHex(
        theme.colorScheme && inDarkColorScheme()
          ? (theme.current.colors.zinc?.[925] ?? getDefaultColors().zinc[925])
          : (theme.current.colors.slate?.[25] ?? getDefaultColors().slate[25]),
      )}
    />
    {#if LINKED_INSTANCE_URL}
      <link rel="icon" href={site.data?.site_view?.site.icon} />
      <meta
        name="description"
        content={site.data?.site_view?.site.description}
      />
    {:else}
      <meta name="description" content="A sleek client for Lemmy" />
    {/if}
  {/if}
</svelte:head>

<Button
  class="fixed -top-16 focus:top-0 left-0 m-4 z-300 transition-all"
  href="#main"
>
  {#snippet prefix()}
    <Icon src={Forward} mini size="16" />
  {/snippet}
  Skip Navigation
</Button>

<Shell>
  <Moderation />
  <ToastContainer />
  <ExpandableImage />
  <ModalContainer />

  {#snippet sidebar({ style: s, class: c })}
    <Sidebar class={c} style={s} />
  {/snippet}
  {#snippet main({ style: s, class: c })}
    <main
      class="px-3 pt-3 sm:px-6 sm:pt-6 min-w-0 w-full flex flex-col h-full relative {c}"
      style={s}
      id="main"
    >
      {@render children?.()}
    </main>
  {/snippet}
  {#snippet navbar({ style: s, class: c })}
    <Navbar class={c} style={s} />
  {/snippet}
  {#snippet suffix({ class: c, style: s })}
    <div class={c} style={s}>
      {#if page.data.slots?.sidebar?.component}
        {@const SvelteComponent = page.data.slots.sidebar.component}
        <SvelteComponent {...page.data.slots.sidebar.props} class="pt-0!" />
      {:else if site.data}
        {#await import('$lib/components/lemmy/SiteCard.svelte') then { default: SiteCard }}
          <SiteCard
            site={site.data.site_view}
            taglines={site.data.taglines}
            admins={site.data.admins}
            version={site.data.version}
          />
        {/await}
      {:else}
        <div class="h-64 w-full grid place-items-center">
          <Spinner width={32} />
        </div>
      {/if}
    </div>
  {/snippet}
</Shell>
