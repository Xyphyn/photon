<script lang="ts" generics="T">
  import { browser } from '$app/environment'
  import { settings } from '$lib/settings.svelte'
  import { debounce } from 'mono-svelte/util/time'
  import { onDestroy, onMount, untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { innerHeight } from 'svelte/reactivity/window'
  import Expandable from '../ui/Expandable.svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    estimatedHeight?: number
    overscan?: number
    item: Snippet<[number]>
    restore?: {
      itemHeights: (number | null)[]
    }
    initialOffset?: number
    debounceResize?: number
    useWindow?: boolean
    height?: number
    useGpu?: boolean
  }

  let {
    items,
    estimatedHeight = 100,
    overscan = 6,
    item: itemSnippet,
    initialOffset = 0,
    restore = $bindable(),
    debounceResize = 100,
    useWindow = true,
    height = 0,
    useGpu = true,
    ...rest
  }: Props = $props()

  let initialRender = false

  export function scrollToIndex(index: number, useWindow: boolean = false) {
    const targetPx = cumulativeItemHeights[index] - (initialOffset || 0)
    if (targetPx < (innerHeight.current ?? 0)) return
    scrollY = targetPx
    if (useWindow && browser) {
      requestAnimationFrame(() => {
        window.scrollTo({ behavior: 'instant', top: scrollY })
      })
    }
  }

  onDestroy(() => {
    restore = {
      itemHeights: itemHeights,
    }
  })

  let virtualListEl = $state<HTMLElement>()

  let itemHeights = $state<(number | null)[]>([
    ...(restore?.itemHeights ?? Array(items.length).fill(null)),
  ])

  let cumulativeItemHeights = $derived.by<number[]>(() => {
    let cumulation = new Array(itemHeights.length)
    let sum = 0

    for (let i = 0; i < itemHeights.length; i++) {
      const height = itemHeights[i] || estimatedHeight
      sum += height
      cumulation[i] = sum
    }

    return cumulation
  })

  let scrollY = $state(0)
  let viewportHeight = $state(0)
  let visibleItems = $state<{ index: number; offset: number }[]>([])

  $effect.pre(() => {
    if (items.length > itemHeights.length) {
      const missing = items.length - itemHeights.length
      itemHeights = [...itemHeights, ...Array(missing).fill(null)]
    }
  })

  $effect(() => {
    if (items.length) {
      untrack(() => {
        visibleItems = updateVisibleItems()
      })
    }
  })

  function findFirstVisibleIndex(
    scrollTop: number,
    cumulativeHeights: number[],
  ): number {
    let low = 0
    let high = cumulativeHeights.length - 1
    let mid = 0

    while (low <= high) {
      mid = Math.floor((low + high) / 2)

      if (cumulativeHeights[mid] <= scrollTop) low = mid + 1
      else high = mid - 1
    }

    return low
  }

  function updateVisibleItems() {
    if (!virtualListEl) return []
    viewportHeight = innerHeight?.current ?? 1000
    const scrollTop = scrollY - initialOffset

    let newVisibleItems: { index: number; offset: number }[] = []

    const firstIndex = findFirstVisibleIndex(scrollTop, cumulativeItemHeights)

    const startIndex = Math.max(0, firstIndex - overscan)

    let i = startIndex
    let offset = i == 0 ? 0 : cumulativeItemHeights[i - 1]

    while (i < items.length) {
      newVisibleItems.push({ index: i, offset: offset })
      const height = itemHeights[i] || estimatedHeight
      offset += height

      if (offset > scrollTop + viewportHeight + overscan * estimatedHeight)
        break

      i++
    }

    return newVisibleItems ?? []
  }

  function resizeObserver(node: HTMLElement) {
    const debouncedUpdate = debounce((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const indexAttr = node.getAttribute('data-index')
        if (indexAttr === null) continue
        const index = Number(indexAttr)
        if (isNaN(index)) continue

        const newHeight = entry.contentRect.height
        if (itemHeights[index] !== newHeight) {
          itemHeights[index] = newHeight
          if (!initialRender) visibleItems = updateVisibleItems()
        }
      }
    }, debounceResize)

    const observer = new ResizeObserver((entries) => {
      debouncedUpdate(entries)
    })

    observer.observe(node)

    onDestroy(() => {
      observer.disconnect()
    })

    return {
      destroy() {
        observer.disconnect()
      },
    }
  }

  // Scroll position changes (only every few px)
  let oldScroll = $state(0)
  $effect(() => {
    const currentScrollY = scrollY ?? 0
    if (Math.abs(currentScrollY - oldScroll) > estimatedHeight) {
      untrack(() => {
        visibleItems = updateVisibleItems()
        oldScroll = currentScrollY
      })
    }
  })

  onMount(() => {
    if (virtualListEl && browser) {
      Array.from(virtualListEl.children).forEach((node) => {
        const indexAttr = node.getAttribute('data-index')
        if (indexAttr === null) return
        const index = Number(indexAttr)
        if (isNaN(index)) return

        const newHeight = node.getBoundingClientRect().height
        if (itemHeights[index] !== newHeight) {
          itemHeights[index] = newHeight
        }
      })
      untrack(() => {
        visibleItems = updateVisibleItems()
        initialRender = false
      })
    }
  })
</script>

<svelte:window
  bind:scrollY={
    () => (useWindow ? scrollY : 0),
    (v) => {
      if (useWindow) scrollY = v
    }
  }
/>

<div
  bind:this={virtualListEl}
  style="position: relative; height: {height ||
    cumulativeItemHeights[visibleItems?.[visibleItems.length - 1]?.index]}px;"
  {...rest}
  id="feed"
  onscroll={() => {
    if (!useWindow) scrollY = virtualListEl?.scrollTop ?? 0
  }}
>
  {#if !useGpu}
    <div
      style="height: {cumulativeItemHeights[visibleItems?.[0]?.index - 1] ||
        0}px; border: 0 !important;"
    ></div>
  {/if}
  {#each visibleItems as item (item.index)}
    <div
      data-index={item.index}
      class={[
        'post-container fix-divide group/virtual w-full',
        useGpu && 'absolute',
      ]}
      style="{useGpu
        ? `transform: translateY(${item.offset}px);`
        : ''} will-change: transform;"
      use:resizeObserver
    >
      {@render itemSnippet(item.index)}
    </div>
  {/each}
</div>
{#if settings.debugInfo}
  <Expandable>
    {#snippet title()}
      Debug
    {/snippet}
    <pre>
      Virtual list debug info

      List items: {items.length}
      Rendering items: {visibleItems.length} ({visibleItems[0]
        ?.index} - {visibleItems[visibleItems.length - 1].index})
      Viewport height: {viewportHeight}
      Current scroll position: {scrollY}
      Container height: {cumulativeItemHeights[
        visibleItems?.[visibleItems.length - 1]?.index
      ]}
      Overscan: {overscan}
      Guess item height: {estimatedHeight}
      Bumpscosity: {Math.floor(Math.random() * 5000)}
      Restore data: {JSON.stringify(restore)}
    </pre>
  </Expandable>
{/if}

<style>
  .fix-divide:nth-child(2) {
    border-top: 0;
  }
</style>
