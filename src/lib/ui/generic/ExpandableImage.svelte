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
  import { fade, scale as scaleTransition } from 'svelte/transition'
  import { trapFocus } from 'trap-focus-svelte'

  export function showImage(url: string) {
    pushState('', {
      openImage: url,
    })
  }
</script>

<script lang="ts">
  interface Props {
    /**
     * The full-resolution image URL
     */
    alt?: string
  }

  let { alt = '' }: Props = $props()

  const MIN_ZOOM = 1
  const MAX_ZOOM = 8
  const ZOOM_STEP = 1.5

  let zoom = $state(1)
  let translateX = $state(0)
  let translateY = $state(0)
  let dragging = $state(false)
  let dragStartX = 0
  let dragStartY = 0
  let originX = 0
  let originY = 0
  let pinchStartDistance = 0
  let pinchStartZoom = 1

  function resetView() {
    zoom = 1
    translateX = 0
    translateY = 0
  }

  function clampZoom(value: number) {
    return Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM)
  }

  function setZoom(next: number) {
    const newZoom = clampZoom(next)
    if (newZoom === 1) {
      translateX = 0
      translateY = 0
    }
    zoom = newZoom
  }

  function zoomIn() {
    setZoom(zoom * ZOOM_STEP)
  }

  function zoomOut() {
    setZoom(zoom / ZOOM_STEP)
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    setZoom(zoom * factor)
  }

  function handlePointerDown(e: PointerEvent) {
    if (zoom <= 1) return
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    originX = translateX
    originY = translateY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return
    translateX = originX + (e.clientX - dragStartX)
    translateY = originY + (e.clientY - dragStartY)
  }

  function handlePointerUp(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchStartDistance = Math.hypot(dx, dy)
      pinchStartZoom = zoom
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 2 && pinchStartDistance > 0) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.hypot(dx, dy)
      setZoom((distance / pinchStartDistance) * pinchStartZoom)
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (e.touches.length < 2) pinchStartDistance = 0
  }

  function handleBackgroundClick() {
    if (zoom > 1) {
      resetView()
      return
    }
    history.back()
  }

  $effect(() => {
    if (!page.state.openImage) resetView()
  })
</script>

{#if page.state.openImage || '' != ''}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 left-0 w-screen h-svh overflow-hidden bg-white/50 dark:bg-black/50
    flex flex-col z-100 backdrop-blur-xs touch-none"
    transition:fade={{ duration: 150 }}
    onclick={handleBackgroundClick}
    onkeydown={(e) => {
      if (e.key == 'Escape') history.back()
      else if (e.key == '+' || e.key == '=') zoomIn()
      else if (e.key == '-') zoomOut()
      else if (e.key == '0') resetView()
    }}
    onwheel={handleWheel}
    use:trapFocus
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="flex-1 flex items-center justify-center overflow-hidden min-h-0"
      onclick={(e) => e.stopPropagation()}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
    >
      <img
        src={page.state.openImage}
        class={[
          'max-w-full max-h-full object-contain select-none',
          dragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in',
        ]}
        style="transform: translate({translateX}px, {translateY}px) scale({zoom}); transition: {dragging
          ? 'none'
          : 'transform 150ms ease-out'};"
        transition:scaleTransition={{
          start: 1.04,
          easing: backOut,
          duration: 250,
        }}
        ondblclick={(e) => {
          e.stopPropagation()
          zoom > 1 ? resetView() : setZoom(2)
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
          onclick={zoomOut}
          color="tertiary"
          size="square-lg"
          rounding="pill"
          aria-label="Zoom out"
          icon={MagnifyingGlassMinus}
          disabled={zoom <= MIN_ZOOM}
        ></Button>
        <Button
          onclick={zoomIn}
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
