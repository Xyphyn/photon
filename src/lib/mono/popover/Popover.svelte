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
  import type { Attachment } from 'svelte/attachments'
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
    popoverClass?: string
    target?: import('svelte').Snippet<[Attachment]>
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
    popoverClass = '',
    target,
    popover,
    children,
  }: Props = $props()

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
    onComputed: ({ placement }) => {
      if (popoverEl) {
        popoverEl.style.transformOrigin = origins[placement]
      }
    },
  })

  const menuAttach: Attachment = element => {
    const e = element as HTMLButtonElement

    const mouseLeave = () => (openOnHover ? (open = false) : false)
    const focus = () => (openOnHover ? (open = true) : false)
    const focusout = () => (openOnHover ? (open = false) : false)
    const click = () => {
      open = !open

      if (autoClose) {
        const clickHandler = (event: Event) => {
          if (!e) return

          if (!e?.contains(event.target as Node | null)) {
            if (!autoClose) {
              // @ts-expect-error svelte hell
              if (popoverEl && !popoverEl.contains(event.target)) {
                open = false
              }
            } else {
              open = false
            }
            document.removeEventListener('click', clickHandler)
          }
        }
        document.addEventListener('click', clickHandler)
      }
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') open = false
    }

    e.addEventListener('mouseleave', mouseLeave)
    e.addEventListener('focus', focus)
    e.addEventListener('focusout', focusout)
    e.addEventListener('click', click)
    e.addEventListener('keydown', keydown)

    floatingRef(e)

    return () => {
      e.removeEventListener('mouseleave', mouseLeave)
      e.removeEventListener('focus', focus)
      e.removeEventListener('focusout', focusout)
      e.removeEventListener('click', click)
      e.removeEventListener('keydown', keydown)
    }
  }
</script>

{@render target?.(menuAttach)}

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
      use:floatingContent
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
