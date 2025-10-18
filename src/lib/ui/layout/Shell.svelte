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
    navbar?: Snippet<[{ class: ClassValue; style?: string }]>
    sidebar?: Snippet<[{ class: ClassValue; style?: string }]>
    main?: Snippet<[{ class: ClassValue; style?: string }]>
    suffix?: Snippet<[{ class: ClassValue; style?: string }]>
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
    class={['shell-navbar-holder', !dockVisible && 'max-md:-bottom-24']}
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
      class: ['shell-navbar'],
    })}
  </div>
  <div class={['shell-content flex-1', settings.newWidth && 'limit-width']}>
    {@render sidebar?.({
      class: `shell-aside shell-sidebar`,
    })}
    {@render main?.({
      class: `shell-main`,
    })}
    {@render suffix?.({
      class: `shell-aside shell-suffix`,
    })}
  </div>
</div>

<style>
  @reference '../../../app.css';

  .shell-navbar-holder {
    position: fixed;
    bottom: 0;
    z-index: 50;
    pointer-events: none;
    width: 100%;
    transition: bottom 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);

    @variant md {
      position: sticky;
      top: 0;
    }

    :global {
      .shell-navbar {
        pointer-events: auto;
        backdrop-filter: blur(var(--blur-xl));
        border-width: 1px;
        border-color: var(--color-slate-100);
        border-top: none;
        background-color: var(--color-slate-50);

        @variant md {
          border-left: none;
          border-right: none;
          background-color: --alpha(var(--color-slate-50) / 70%);
        }

        @variant dark {
          background-color: var(--color-zinc-950);
          border-color: var(--color-zinc-900);
          @variant md {
            background-color: --alpha(var(--color-zinc-950) / 70%);
          }
        }
      }
    }
  }

  .shell-content {
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

  .shell-content.limit-width {
    max-width: 100rem;
  }

  @media (min-width: 48rem) {
    .shell-content {
      grid-template-columns: 16rem 1fr;
      justify-items: end start;
      grid-template-areas: 'sidebar main';
    }
  }

  @media (min-width: 64rem) {
    .shell-content {
      grid-template-columns: 20% 60% 20%;
      justify-items: end center start;
      grid-template-areas: 'sidebar main suffix';
    }

    .shell-content.limit-width {
      width: 100%;
      grid-template-columns: 2fr 5fr 2fr;
    }
  }

  .shell-content {
    :global {
      .shell-main {
        width: 100%;
        grid-area: main;
        background-color: var(--color-slate-25);
        border-left: 1px solid var(--color-slate-100);
        border-right: 1px solid var(--color-slate-100);
        padding-bottom: calc(var(--spacing) * 22);

        @variant dark {
          background-color: var(--color-zinc-925);
          border-left: 1px solid var(--color-zinc-900);
          border-right: 1px solid var(--color-zinc-900);
        }

        @variant md {
          padding-bottom: calc(var(--spacing) * 6);
        }
      }

      .shell-aside {
        display: none;
        position: sticky;
        top: 0;
        left: 0;
        background-color: var(--color-slate-50);
        z-index: 40;
        width: 100%;

        @variant dark {
          background-color: var(--color-zinc-950);
        }
      }

      .shell-sidebar {
        grid-area: sidebar;
        width: 100% !important;
        @variant md {
          display: flex;
          top: calc(var(--spacing) * 16);
          max-height: calc(100vh - 4rem);
        }
      }

      .shell-suffix {
        grid-area: suffix;
        @variant lg {
          display: flex;
          top: calc(var(--spacing) * 16);
          max-height: calc(100vh - 4rem);
        }
      }
    }
  }
</style>
