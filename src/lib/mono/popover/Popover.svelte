<script context="module" lang="ts">
  export type Origin = keyof typeof popoverOrigins

  export const popoverOrigins = {
    'top-right': 'bottom-full right-0 origin-bottom-right',
    'bottom-left': 'top-full origin-top-left',
    'top-left': 'bottom-full left-0 origin-bottom-left',
    'bottom-right': 'top-full right-0 origin-top-right',
    'top-center': 'bottom-full -left-[450%] origin-bottom',
    'bottom-center': 'top-full -left-[450%] origin-top',
  }
</script>

<script lang="ts">
  import { Material } from '../index'
  import { backOut, elasticIn, elasticOut, expoOut } from 'svelte/easing'
  import { fly, scale } from 'svelte/transition'
  import { createFloatingActions } from 'svelte-floating-ui'
  import {
    offset,
    type Middleware,
    flip,
    shift,
    type Placement,
    type Strategy,
    size,
  } from '@floating-ui/core'
  import Portal from './Portal.svelte'
  import { focusTrap } from 'svelte-focus-trap'
  import { tick } from 'svelte'

  export let openOnHover: boolean = false
  export let open = false
  export let placement: Placement = 'bottom-start'
  export let middleware: Middleware[] = [offset(6), shift(), flip()]
  export let strategy: Strategy = 'fixed'
  export let manual: boolean = false

  let canUseContents = true

  let el: any

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: strategy,
    placement: placement,
    middleware: middleware,
  })

  const customFloatingContent = (node: HTMLDivElement) => {
    // if (!canUseContents) return

    floatingContent(node)
  }

  const customFloatingRef = (node: HTMLButtonElement) => {
    const n = node.children.item(0)

    // @ts-ignore
    if (n) floatingRef(n)
    else {
      canUseContents = false
      floatingRef(node)
    }
  }

  export let popoverClass: string = ''
  let clazz: string = ''
  export { clazz as class }
</script>

<svelte:body
  on:click={(e) => {
    if (openOnHover) return

    if (!el?.contains(e.target) && open) {
      open = false
    }
  }}
  on:keydown={async (e) => {
    if (open && e.key == 'Escape') {
      open = false
      el?.firstChild.focus()
    }
  }}
/>

{#if $$slots.target}
  <button
    on:mouseover={() => (openOnHover ? (open = true) : false)}
    on:mouseleave={() => (openOnHover ? (open = false) : false)}
    on:focus={() => (openOnHover ? (open = true) : false)}
    on:focusout={() => (openOnHover ? (open = false) : false)}
    on:click={() => (!openOnHover && !manual ? (open = !open) : false)}
    on:keydown={(e) => {
      if (e.key == 'Escape') open = false
    }}
    role="menu"
    type="button"
    class="{canUseContents ? 'contents text-left' : 'w-max h-max'} {clazz}"
    bind:this={el}
    use:customFloatingRef
  >
    <slot name="target" />
  </button>
{/if}

{#if open}
  <Portal class="z-[150]">
    <div
      transition:scale={{ duration: 200, start: 0.96, easing: backOut }}
      class="z-[150] {popoverClass}"
      use:customFloatingContent
      use:focusTrap
    >
      <slot name="popover">
        <Material elevation="high" color="distinct" class="flex flex-col">
          <slot />
        </Material>
      </slot>
    </div>
  </Portal>
{/if}
