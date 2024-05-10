<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { colors, colorsToVars } from '$lib/ui/colors'
  import { routes } from '$lib/util.js'

  export let route: { id: string | null } | undefined = undefined

  $: title = route ? routes[(route.id as keyof typeof routes) ?? ''] : ''

  const calculatePadding = (
    panel: boolean,
    top: boolean,
    content: boolean
  ): string => {
    if (panel) {
      if (top) {
        if (content) return '!pt-20'
        else return 'top-16'
      } else return '!pb-20'
    } else {
      if (!content) return ''

      if (top) return '!pt-24'
      else return '!pb-24'
    }

    return 'hi this is easter egg, my code broke'
  }

  $: contentPadding = calculatePadding(
    $userSettings.dock.noGap,
    $userSettings.dock.top,
    true
  )
  $: sidePadding = calculatePadding(
    $userSettings.dock.noGap,
    $userSettings.dock.top,
    false
  )
  $: topPanel = $userSettings.dock.noGap && $userSettings.dock.top
</script>

<div class="shell {$$props.class}" style={colorsToVars($colors)}>
  <slot />
  <div
    class="
    {$userSettings.dock.noGap ? '' : 'p-4 max-w-3xl left-1/2 -translate-x-1/2'}
    {$userSettings.dock.top ? 'top-0' : 'bottom-0'}
    {topPanel ? 'fixed top-0' : 'fixed'}
    w-full z-50 pointer-events-none"
    style="grid-area: navbar;"
  >
    <slot
      name="navbar"
      class="
      {$userSettings.dock.noGap
        ? $userSettings.dock.top
          ? 'border-b shadow-none'
          : 'border-t'
        : 'border rounded-full'}
      border-slate-200 dark:border-zinc-800 shadow-2xl
      backdrop-blur-xl dark:backdrop-brightness-[25%] bg-[#ffffff]/75 dark:bg-transparent transition-colors duration-500
      pointer-events-auto"
      {title}
    />
  </div>
  <div
    class="content divide-slate-200 dark:divide-zinc-900 min-h-screen {$userSettings.newWidth
      ? 'limit-width'
      : ''}"
  >
    <slot
      name="sidebar"
      class="hidden md:flex sticky top-0 left-0 w-full max-w-full h-max bg-slate-50 dark:bg-zinc-950
      z-40
      {sidePadding}"
      style="grid-area: sidebar; width: 100% !important;"
    />
    <slot
      name="main"
      class="w-full bg-slate-25 dark:bg-zinc-925 justify-self-center shadow-sm
      {contentPadding}"
      style="grid-area: main"
    />
    <slot
      name="suffix"
      class="max-xl:hidden w-full sticky top-0 left-0 h-max bg-slate-50 dark:bg-zinc-950 z-40 {sidePadding}"
      style="grid-area: suffix;"
    />
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

  @media (min-width: 768px) {
    .content {
      grid-template-columns: 14rem 2fr;
      justify-items: end start;
      grid-template-areas: 'sidebar main';
    }
  }

  @media (min-width: 1280px) {
    .content {
      grid-template-columns: 20% 1fr 20%;
      justify-items: end center start;
      grid-template-areas: 'sidebar main suffix';
    }
  }

  .limit-width {
    max-width: 100rem;
  }
</style>
