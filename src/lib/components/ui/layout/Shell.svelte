<script lang="ts">
  import { userSettings } from '$lib/settings.js'
  import { colors, colorsToVars } from '$lib/ui/colors'
  import { routes } from '$lib/util.js'

  export let route: { id: string | null } | undefined = undefined

  $: title = route ? routes[(route.id as keyof typeof routes) ?? ''] : ''
</script>

<div class="shell {$$props.class}" style={colorsToVars($colors)}>
  <slot />
  <div
    class="content md:divide-x divide-slate-200 dark:divide-zinc-900 {$userSettings.newWidth
      ? 'limit-width'
      : ''}"
  >
    <slot
      name="sidebar"
      class="hidden md:flex sticky top-0 left-0 w-full max-w-full bg-slate-50 dark:bg-zinc-950"
      style="grid-area: sidebar; width: 100% !important;"
    />
    <slot
      name="main"
      class="w-full bg-slate-25 dark:bg-zinc-925 justify-self-center shadow-sm"
      style="grid-area: main"
    />
    <slot
      name="suffix"
      class="max-xl:hidden w-full sticky top-0 left-0 h-max bg-slate-50 dark:bg-zinc-950"
      style="grid-area: suffix;"
    />
  </div>
  <div
    class="p-4 w-full sticky bottom-0 z-50 max-w-3xl mx-auto"
    style="grid-area: navbar;"
  >
    <slot
      name="navbar"
      class="border rounded-full border-slate-200 dark:border-zinc-800 shadow-2xl
      bg-white dark:bg-zinc-950 transition-colors duration-500"
      style="grid-area: navbar"
      {title}
    />
  </div>
</div>

<style>
  .shell {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'content'
      'navbar';
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
      grid-template-columns: min-content 2fr;
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
