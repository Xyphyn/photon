<script lang="ts">
  import { settings } from '$lib/settings.svelte.js'
  import type { Snippet } from 'svelte'
  import type {
    ClassValue,
    HTMLAttributes,
    UIEventHandler,
  } from 'svelte/elements'
  import { scrollY } from 'svelte/reactivity/window'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    navbar?: Snippet<[{ class: ClassValue; style: string }]>
    sidebar?: Snippet<[{ class: ClassValue; style: string }]>
    main?: Snippet<[{ class: ClassValue; style: string }]>
    suffix?: Snippet<[{ class: ClassValue; style: string }]>
  }

  let { children, navbar, sidebar, main, suffix }: Props = $props()

  let previousTop = 0
  const onscroll: UIEventHandler<Window> = () => {
    if (!settings.dock.autoHide) {
      dockVisible = true
      return
    }

    dockVisible = (scrollY?.current ?? 0) <= previousTop
    previousTop = scrollY?.current ?? 0
  }

  let dockVisible = $state(true)
</script>

<svelte:window {onscroll} />

{@render children?.()}
<div
  class={[
    'fixed bottom-0 lg:top-0',
    !dockVisible && 'max-lg:-bottom-24',
    'max-w-3xl p-4 left-1/2 -translate-x-1/2 lg:max-w-full lg:p-0 lg:left-0 lg:translate-x-0',
    'w-full z-50 pointer-events-none',
  ]}
  style="transition: bottom .4s cubic-bezier(0.075, 0.82, 0.165, 1);"
>
  {@render navbar?.({
    class: [
      'bg-slate-50/50 dark:bg-zinc-950/90 border-slate-100 dark:border-zinc-900',
      'pointer-events-auto backdrop-blur-xl border lg:border-t-0 lg:border-x-0',
      'rounded-full lg:rounded-none',
    ],
    style: '',
  })}
</div>
<div
  class={[
    'content divide-x divide-slate-100 dark:divide-zinc-900 min-h-screen',
    settings.newWidth && 'limit-width',
  ]}
>
  {@render sidebar?.({
    class: `hidden md:flex sticky top-0 lg:top-16 left-0 h-max bg-slate-50 dark:bg-zinc-950 z-40`,
    style: 'grid-area: sidebar; width: 100% !important;',
  })}
  {@render main?.({
    class: `w-full bg-slate-25 dark:bg-zinc-925 justify-self-center shadow-xs main pb-22 lg:pt-20! pb-4 sm:pb-6`,
    style: 'grid-area: main',
  })}
  {@render suffix?.({
    class: `max-xl:hidden w-full sticky lg:top-20 h-max max-h-screen overflow-auto left-0 bg-slate-50 dark:bg-zinc-950 z-40`,
    style: 'grid-area: suffix;',
  })}
</div>

<style>
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
    max-width: 110rem;
  }

  @media (min-width: 768px) {
    .content {
      grid-template-columns: 16rem 1fr;
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
      width: 100%;
      grid-template-columns: 2fr 5fr 2fr;
    }
  }
</style>
