<script lang="ts" module>
  import { innerWidth, scrollY } from 'svelte/reactivity/window'

  const calculateDockProperties = (
    settings: {
      top: boolean | null
      noGap: boolean | null
    },
    screenWidth: number,
  ): {
    noGap: boolean
    top: boolean
  } => {
    let panel = false
    let top = false

    if (screenWidth >= 1024) {
      panel = true
      top = true
    }

    panel = settings.noGap ?? panel
    top = settings.top ?? top

    return {
      noGap: panel,
      top: top,
    }
  }

  export const calculatePadding = (
    panel: boolean,
    top: boolean,
    content: boolean,
  ): {
    top: number
    bottom: number
    class: string
  } => {
    if (panel) {
      if (top) {
        if (content) return { top: 80, class: '!pt-20', bottom: 0 }
        else
          return {
            top: 64,
            class: 'top-16 !max-h-[calc(100vh-4rem)]',
            bottom: 0,
          }
      } else return { top: 0, class: '!pb-20', bottom: 80 }
    } else {
      if (!content) return { top: 0, class: '', bottom: 0 }

      if (top) return { top: 96, class: '!pt-24', bottom: 0 }
      else return { top: 0, class: '!pb-24', bottom: 96 }
    }

    return { top: 0, class: ' failed-to-calculate', bottom: 0 }
  }

  let dockProps = $derived(
    calculateDockProperties(settings.dock, innerWidth.current ?? 1000),
  )
  let contentPadding = $derived(
    calculatePadding(dockProps.noGap, dockProps.top, true),
  )

  let contentPaddingStore = writable<{
    top: number
    bottom: number
    class: string
  }>(contentPadding)
  let dockPropsStore = writable<{
    noGap: boolean
    top: boolean
  }>(dockProps)

  $effect.root(() => {
    $effect(() => {
      dockPropsStore.set(
        calculateDockProperties(settings.dock, innerWidth.current ?? 1000),
      )
      contentPaddingStore.set(
        calculatePadding(dockProps.noGap, dockProps.top, true),
      )
    })
  })

  export { contentPaddingStore as contentPadding, dockPropsStore as dockProps }
</script>

<script lang="ts">
  import { settings } from '$lib/settings.svelte.js'
  import { theme } from '$lib/ui/colors.svelte'
  import { writable, type Readable, type Writable } from 'svelte/store'
  import type { ClassValue, UIEventHandler } from 'svelte/elements'

  interface Props {
    route?: { id: string | null } | undefined
    class?: ClassValue
    children?: import('svelte').Snippet
    navbar?: import('svelte').Snippet<[any]>
    sidebar?: import('svelte').Snippet<[any]>
    main?: import('svelte').Snippet<[any]>
    suffix?: import('svelte').Snippet<[any]>
    [key: string]: any
  }

  let {
    route = undefined,
    class: clazz = '',
    children,
    navbar,
    sidebar,
    main,
    suffix,
    ...rest
  }: Props = $props()

  let previousTop = 0
  const onscroll: UIEventHandler<Window> = (e) => {
    dockVisible = (scrollY?.current ?? 0) > previousTop

    previousTop = scrollY?.current ?? 0
  }

  let dockVisible = $state(true)
</script>

<svelte:window {onscroll} />

<div
  {...rest}
  class="shell bg-slate-50 dark:bg-zinc-950 {clazz}"
  style={theme.vars}
>
  {@render children?.()}
  <div
    class="fixed lg:sticky bottom-0 {dockVisible
      ? 'max-lg:-bottom-24'
      : ''}  lg:top-0
    max-w-3xl p-4 left-1/2 -translate-x-1/2 lg:max-w-full lg:p-0 lg:left-0 lg:translate-x-0
    w-full z-50 pointer-events-none"
    style="grid-area: navbar;
    transition: bottom .4s cubic-bezier(0.075, 0.82, 0.165, 1);"
  >
    {@render navbar?.({
      class: `bg-slate-50/50 dark:bg-zinc-950/90 border-slate-100 dark:border-zinc-900
      pointer-events-auto backdrop-blur-xl border lg:border-t-0 lg:border-x-0
      rounded-full lg:rounded-none`,
    })}
  </div>
  <div
    class="content divide-x divide-slate-100 dark:divide-zinc-900 min-h-screen {settings.newWidth
      ? 'limit-width'
      : ''}"
  >
    {@render sidebar?.({
      class: `hidden md:flex sticky top-0 left-0 h-max bg-slate-50 dark:bg-zinc-950
      z-40 lg:top-16`,
      style: 'grid-area: sidebar; width: 100% !important;',
    })}
    {@render main?.({
      class: `w-full bg-slate-25 dark:bg-zinc-925 justify-self-center shadow-sm z-0 main`,
      style: 'grid-area: main',
    })}
    {@render suffix?.({
      class: `max-xl:hidden w-full sticky top-0 left-0 max-h-screen bg-slate-50 dark:bg-zinc-950
      z-40 lg:top-16`,
      style: 'grid-area: suffix;',
    })}
  </div>
</div>

<style>
  .shell {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'navbar'
      'content';
  }

  .content {
    width: 100%;
    display: grid;
    margin-left: auto;
    margin-right: auto;
    grid-area: content;
    grid-template-columns: 1fr;
    grid-template-areas: 'main';
    justify-items: start;
  }

  .content.limit-width {
    max-width: 120rem;
  }

  .content > * {
    width: 100%; /* Full width for immediate children */
  }

  @media (min-width: 768px) {
    .content {
      grid-template-columns: 14rem 2fr;
      justify-items: end start;
      grid-template-areas: 'sidebar main';
    }
  }

  @media (min-width: 1280px) {
    .content {
      grid-template-columns: 20% 60% 20%;
      justify-items: end center start;
      grid-template-areas: 'sidebar main suffix';
    }

    .content.limit-width {
      grid-template-columns: 1fr 2fr 1fr;
    }

    :global(.content.limit-width > *:first-child) {
      max-width: 20rem;
      justify-self: end;
      width: 100%;
    }

    :global(.content.limit-width > *:last-child) {
      max-width: 20rem;
      justify-self: start;
      width: 100%;
    }

    .main {
      width: 100%;
    }
  }
</style>
