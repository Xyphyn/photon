<script lang="ts">
  import { settings } from '$lib/app/settings.svelte'
  import type { Snippet } from 'svelte'
  import type {
    ClassValue,
    HTMLAttributes,
    UIEventHandler,
  } from 'svelte/elements'
  import { scrollY } from 'svelte/reactivity/window'
  import InvertedCorner from './InvertedCorner.svelte'

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
<div class="min-h-screen flex flex-col">
  <div
    class={[
      'fixed md:sticky bottom-0 md:top-0',
      !dockVisible && 'max-md:-bottom-24',
      'w-full z-50 pointer-events-none',
    ]}
    style="transition: bottom .4s cubic-bezier(0.075, 0.82, 0.165, 1);"
    aria-hidden="true"
  >
    <div class="md:hidden flex justify-between" dir="ltr">
      <InvertedCorner
        class="w-8 h-8 text-slate-100 dark:text-zinc-950 rotate-270"
      />
      <InvertedCorner
        class="w-8 h-8 text-slate-100 dark:text-zinc-950 rotate-180"
      />
    </div>
    {@render navbar?.({
      class: [
        'md:bg-slate-100/70 md:dark:bg-zinc-950/90 border-slate-200/50 dark:border-zinc-900',
        'bg-slate-100 dark:bg-zinc-950',
        'pointer-events-auto backdrop-blur-xl border border-t-0 md:border-x-0',
      ],
      style: '',
    })}
  </div>
  <div class={['content flex-1', settings.newWidth && 'limit-width']}>
    {@render sidebar?.({
      class: `hidden md:flex sticky top-0 lg:top-16 left-0 max-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-zinc-950 z-40`,
      style: 'grid-area: sidebar; width: 100% !important;',
    })}
    {@render main?.({
      class: `w-full bg-slate-50 dark:bg-zinc-925 max-lg:pb-22 justify-self-center border-x border-slate-200 dark:border-zinc-900 pb-3 lg:pb-6`,
      style: 'grid-area: main',
    })}
    {@render suffix?.({
      class: `max-lg:hidden flex w-full sticky top-0 lg:top-16 left-0 max-h-[calc(100vh-4rem)] overflow-auto bg-slate-100 dark:bg-zinc-950 z-40`,
      style: 'grid-area: suffix;',
    })}
  </div>
</div>

<style>
  .content {
    width: 100%;
    display: grid;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    grid-area: content;
    grid-template-columns: 1fr;
    grid-template-areas: 'main';
    justify-items: start;
  }

  .content.limit-width {
    max-width: 100rem;
  }

  @media (min-width: 48rem) {
    .content {
      grid-template-columns: 16rem 1fr;
      justify-items: end start;
      grid-template-areas: 'sidebar main';
    }
  }

  @media (min-width: 64rem) {
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
