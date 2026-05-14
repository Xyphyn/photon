<script lang="ts" module>
  import { pushState } from '$app/navigation'
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { Button, Material, toast } from 'mono-svelte'
  import {
    MagnifyingGlassMinus,
    MagnifyingGlassPlus,
    Share,
    XMark,
  } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'
  import { trapFocus } from 'trap-focus-svelte'

  export function showImage(url: string) {
    pushState('', { openImage: url })
  }

  const MIN_ZOOM = 1
  const MAX_ZOOM = 8
  const ZOOM_STEP = 1.5
  const clamp = (value: number) => Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM)
</script>

<script lang="ts">
  let { alt = '' }: { alt?: string } = $props()

  let zoom = $state(1)
  let tx = $state(0)
  let ty = $state(0)
  let dragging = $state(false)

  let drag = { x: 0, y: 0, tx: 0, ty: 0 }
  let pinch = { distance: 0, zoom: 1 }

  function reset() {
    zoom = 1
    tx = 0
    ty = 0
  }

  function setZoom(next: number) {
    zoom = clamp(next)
    if (zoom === 1) {
      tx = 0
      ty = 0
    }
  }

  $effect(() => {
    if (!page.state.openImage) reset()
  })

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    setZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1))
  }

  function onPointerDown(e: PointerEvent) {
    if (zoom <= 1) return
    dragging = true
    drag = { x: e.clientX, y: e.clientY, tx, ty }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return
    tx = drag.tx + (e.clientX - drag.x)
    ty = drag.ty + (e.clientY - drag.y)
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 2) return
    e.preventDefault()
    const [a, b] = [e.touches[0], e.touches[1]]
    pinch = {
      distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      zoom,
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length !== 2 || pinch.distance === 0) return
    e.preventDefault()
    const [a, b] = [e.touches[0], e.touches[1]]
    const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    setZoom((d / pinch.distance) * pinch.zoom)
  }

  function onTouchEnd(e: TouchEvent) {
    if (e.touches.length < 2) pinch.distance = 0
  }

  function onBackgroundClick() {
    if (zoom > 1) reset()
    else history.back()
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') history.back()
    else if (e.key === '+' || e.key === '=') setZoom(zoom * ZOOM_STEP)
    else if (e.key === '-') setZoom(zoom / ZOOM_STEP)
    else if (e.key === '0') reset()
  }
</script>

{#if page.state.openImage}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 w-screen h-svh overflow-hidden bg-white/50 dark:bg-black/50
      flex flex-col z-100 backdrop-blur-xs touch-none"
    transition:fade={{ duration: 150 }}
    onclick={onBackgroundClick}
    onkeydown={onKey}
    onwheel={onWheel}
    use:trapFocus
  >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
      ontouchstart={onTouchStart}
      ontouchmove={onTouchMove}
      ontouchend={onTouchEnd}
    >
      <img
        src={page.state.openImage}
        class="max-w-full max-h-full object-contain select-none"
        class:cursor-grabbing={dragging}
        class:cursor-grab={!dragging && zoom > 1}
        class:cursor-zoom-in={zoom === 1}
        style:transform="translate({tx}px, {ty}px) scale({zoom})"
        style:transition={dragging ? 'none' : 'transform 150ms ease-out'}
        transition:scale={{ start: 1.04, easing: backOut, duration: 250 }}
        ondblclick={(e) => {
          e.stopPropagation()
          if (zoom > 1) reset()
          else setZoom(2)
        }}
        draggable="false"
        {alt}
      />
    </div>
    <div class="sticky z-10 bottom-4 left-1/2 -translate-x-1/2 w-max">
      <Material
        class="gap-1 p-0.5 px-1 flex flex-row items-center"
        rounding="full"
        padding="none"
        color="uniform"
        onclick={(e) => e.stopPropagation()}
      >
        <Button
          onclick={() => setZoom(zoom / ZOOM_STEP)}
          color="tertiary"
          size="square-lg"
          rounding="pill"
          aria-label="Zoom out"
          icon={MagnifyingGlassMinus}
          disabled={zoom <= MIN_ZOOM}
        ></Button>
        <Button
          onclick={() => setZoom(zoom * ZOOM_STEP)}
          color="tertiary"
          size="square-lg"
          rounding="pill"
          aria-label="Zoom in"
          icon={MagnifyingGlassPlus}
          disabled={zoom >= MAX_ZOOM}
        ></Button>
        <Button
          onclick={() => {
            navigator.clipboard.writeText(page.state?.openImage ?? '')
            toast({ content: $t('toast.copied') })
          }}
          color="tertiary"
          size="square-lg"
          rounding="pill"
          aria-label={$t('post.actions.more.share')}
          icon={Share}
        ></Button>
        <Button
          onclick={() => history.back()}
          color="tertiary"
          size="square-lg"
          rounding="pill"
          aria-label={$t('common.back')}
          icon={XMark}
        ></Button>
      </Material>
    </div>
  </div>
{/if}
