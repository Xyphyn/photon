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
    popover?: import('svelte').Snippet
    children?: import('svelte').Snippet
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

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: strategy,
    placement: placement,
    middleware: middleware,
  })

  const customFloatingContent = (node: HTMLDivElement) => floatingContent(node)

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
      transition:scale={{ duration: 300, start: 0.97, easing: expoOut }}
      class="z-150 {popoverClass}"
      use:customFloatingContent
      use:focusTrap
      bind:this={popoverEl}
    >
      {#if popover}{@render popover()}{:else}
        <Material elevation="high" color="distinct" class="flex flex-col">
          {@render children?.()}
        </Material>
      {/if}
    </div>
  </Portal>
{/if}
