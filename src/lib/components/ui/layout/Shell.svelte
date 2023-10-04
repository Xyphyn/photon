<script lang="ts">
  import Navbar from '$lib/components/ui/Navbar.svelte'
  import { userSettings } from '$lib/settings.js'
  import { routes } from '$lib/util.js'

  export let route: { id: string | null } | undefined = undefined

  $: title = route ? routes[(route.id as keyof typeof routes) ?? ''] : ''

  let scroll = 0
</script>

<svelte:window bind:scrollY={scroll} />

<div class="shell {$$props.class}">
  <slot
    name="navbar"
    class="sticky top-0 border-b border-slate-200 dark:border-zinc-900
    {scroll > 0
      ? 'bg-slate-50/70 dark:bg-zinc-950/70'
      : 'bg-slate-50 dark:bg-zinc-950'} transition-colors duration-500"
    style="grid-area: navbar"
    {title}
  />
  <div
    class="content md:divide-x divide-slate-200 dark:divide-zinc-900 {$userSettings.newWidth
      ? 'limit-width'
      : ''}"
  >
    <slot
      name="sidebar"
      class="hidden md:flex sticky top-16 justify-self-end left-0 w-full max-w-full"
      style="grid-area: sidebar; max-width: 20rem;"
    />
    <slot
      name="main"
      class="w-full bg-slate-25 dark:bg-transparent justify-self-center"
      style="grid-area: main"
    />
    <slot
      name="suffix"
      class="hidden xl:flex w-full justify-self-start"
      style="grid-area: suffix; max-width: 20rem;"
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
      grid-template-columns: 1fr 2fr;
      justify-items: end start;
      grid-template-areas: 'sidebar main';
    }
  }

  @media (min-width: 1280px) {
    .content {
      grid-template-columns: 1fr 3fr 1fr;
      justify-items: end center start;
      grid-template-areas: 'sidebar main suffix';
    }
  }

  .limit-width {
    max-width: 96rem;
  }
</style>
