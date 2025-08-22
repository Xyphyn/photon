<script lang="ts">
  import {
    flip,
    offset,
    shift,
    type Middleware,
    type Placement,
    type Strategy,
  } from '@floating-ui/core'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { focusTrap } from 'svelte-focus-trap'
  import { expoOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'
  import { Material } from '../index'
  import Portal from './Portal.svelte'

  interface Props {
    openOnHover?: boolean
    open?: boolean
    autoClose?: boolean
    placement?: Placement
    middleware?: Middleware[]
    strategy?: Strategy
    manual?: boolean
    popoverClass?: string
    class?: string
    target?: import('svelte').Snippet
    popover?: import('svelte').Snippet<[boolean]>
    children?: import('svelte').Snippet<[boolean]>
  }

  let {
    openOnHover = false,
    open = $bindable(false),
    autoClose = true,
    placement = 'bottom-start',
    middleware = [offset(6), shift(), flip()],
    strategy = 'fixed',
    manual = false,
    popoverClass = '',
    class: clazz = '',
    target,
    popover,
    children,
  }: Props = $props()

  let canUseContents = $state(true)

  let el = $state<HTMLElement>()
  let popoverEl = $state<HTMLElement>()

  let origins: Record<Placement, string> = {
    bottom: 'top',
    'bottom-end': 'top right',
    'bottom-start': 'top left',
    left: 'left',
    'left-end': 'left',
    'left-start': 'left',
    right: 'right',
    'right-end': 'right',
    'right-start': 'right',
    top: 'bottom',
    'top-end': 'bottom right',
    'top-start': 'bottom',
  }

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: strategy,
    placement: placement,
    middleware: middleware,
    onComputed: ({ x, y, placement }) => {
      if (popoverEl) {
        popoverEl.style.transformOrigin = origins[placement]
      }

      console.log(placement)

      // @ts-expect-error svelte hell
      Object.assign(el?.children?.item?.(0) ?? el, {
        top: '0',
        left: '0',
        transform: `translate3d(${roundByDPR(x)}px,${roundByDPR(y)}px,0)`,
      })
    },
  })

  function roundByDPR(value: number) {
    const dpr = window.devicePixelRatio || 1
    return Math.round(value * dpr) / dpr
  }

  const customFloatingContent = (node: HTMLDivElement) => {
    // if (!canUseContents) return

    floatingContent(node)
  }

  const customFloatingRef = (node: HTMLDivElement) => {
    const n = node.children.item(0)

    // @ts-expect-error svelte hell
    if (n) floatingRef(n)
    else {
      canUseContents = false
      floatingRef(node)
    }
  }
</script>

<svelte:body
  onclick={e => {
    if (openOnHover) return

    // @ts-expect-error svelte hell
    if (!el?.contains(e.target) && open) {
      if (!autoClose) {
        // @ts-expect-error svelte hell
        if (popoverEl && !popoverEl.contains(e.target)) {
          open = false
        }
      } else {
        open = false
      }
    }
  }}
  onkeydown={async e => {
    if (open && e.key == 'Escape') {
      open = false
      // @ts-expect-error svelte hell
      el?.firstChild.focus()
    }
  }}
/>

{#if target}
  <div
    onmouseover={() => (openOnHover ? (open = true) : false)}
    onmouseleave={() => (openOnHover ? (open = false) : false)}
    onfocus={() => (openOnHover ? (open = true) : false)}
    onfocusout={() => (openOnHover ? (open = false) : false)}
    onclick={() => (!openOnHover && !manual ? (open = !open) : false)}
    onkeydown={e => {
      if (e.key == 'Escape') open = false
    }}
    tabindex="0"
    role="button"
    class="{canUseContents ? 'contents text-left' : 'w-max h-max'} {clazz}"
    bind:this={el}
    use:customFloatingRef
  >
    {@render target?.()}
  </div>
{/if}

{#if open}
  <Portal class="z-150">
    <div
      transition:scale={{
        duration: 175,
        start: 0.95,
        opacity: 0,
        easing: expoOut,
      }}
      class="z-150 {popoverClass}"
      use:customFloatingContent
      use:focusTrap
      bind:this={popoverEl}
    >
      {#if popover}{@render popover(open)}{:else}
        <Material elevation="high" color="distinct" class="flex flex-col">
          {@render children?.(open)}
        </Material>
      {/if}
    </div>
  </Portal>
{/if}
