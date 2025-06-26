<script lang="ts" generics="T">
  import { browser } from '$app/environment'
  import { debounce } from 'mono-svelte/util/time'
  import { onDestroy, untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { innerHeight, scrollY } from 'svelte/reactivity/window'

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
  }

  let {
    items,
    estimatedHeight = 100,
    overscan = 5,
    item: itemSnippet,
    initialOffset = 0,
    restore = $bindable(),
    debounceResize = 100,
    ...rest
  }: Props = $props()

  export function scrollToIndex(index: number, useWindow: boolean = false) {
    if (useWindow && browser)
      window.scrollTo({
        behavior: 'instant',
        top: cumulativeItemHeights[index] - initialOffset || 0,
      })
  }

  onDestroy(() => {
    restore = {
      itemHeights: itemHeights,
    }
  })

  let virtualListEl = $state<HTMLElement>()

  let itemHeights = $state<(number | null)[]>(Array.from({ length: Math.max(items.length, (restore?.itemHeights ?? []).length) }, (_, i) => (restore?.itemHeights ?? [])[i] || null))
  
  $effect(() => {
    if (items.length !== itemHeights.length) {
      const newHeights = Array.from({ length: items.length }, (_, i) => 
        itemHeights[i] || null
      )
      itemHeights = newHeights
    }
  })
  
  let cumulativeItemHeights = $derived.by(() => {
    let cumulation = new Array(itemHeights.length)
    let sum = 0

    for (let i = 0; i < itemHeights.length; i++) {
      const height = itemHeights[i] || estimatedHeight
      sum += height
      cumulation[i] = sum
    }

    return cumulation
  })

  let viewportHeight = $state(0)
  let visibleItems = $state<{ index: number; offset: number }[]>([])

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
    const scrollTop = (scrollY.current ?? 0) - initialOffset

    let newVisibleItems: { index: number; offset: number }[] = []

    const firstIndex = findFirstVisibleIndex(scrollTop, cumulativeItemHeights)

    let i = firstIndex
    let offset = i == 0 ? 0 : cumulativeItemHeights[i - 1]

    while (
      i < items.length &&
      i < firstIndex + overscan &&
      offset < scrollTop + viewportHeight + overscan * estimatedHeight
    ) {
      newVisibleItems.push({ index: i, offset: offset })
      const height = itemHeights[i] || estimatedHeight
      offset += height
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
        if (itemHeights[index] !== newHeight && newHeight !== estimatedHeight) {
          itemHeights[index] = newHeight
          visibleItems = updateVisibleItems()
        }
      }
    }, debounceResize)

    const observer = new ResizeObserver(entries => {
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

  // Initial render and viewport changes
  $effect(() => {
    if (virtualListEl && browser) {
      untrack(() => {
        visibleItems = updateVisibleItems()
      })
    }
  })

  // Viewport height changes
  $effect(() => {
    if (innerHeight?.current && browser) {
      untrack(() => {
        visibleItems = updateVisibleItems()
      })
    }
  })

  let oldScroll = $state(0)
  $effect(() => {
    const currentScrollY = scrollY.current ?? 0
      if (Math.abs(currentScrollY - oldScroll) > estimatedHeight) {
        visibleItems = updateVisibleItems()
        oldScroll = currentScrollY
      }
  })
</script>

<div
  bind:this={virtualListEl}
  style="position: relative; height: {cumulativeItemHeights[
    visibleItems?.[visibleItems.length - 1]?.index
  ]}px;"
  {...rest}
  id="feed"
>
  <div
    style="height: {cumulativeItemHeights[visibleItems?.[0]?.index - 1] ||
      0}px; border: 0 !important;"
  ></div>
  {#each visibleItems as item (item.index)}
    <div
      data-index={item.index}
      class="post-container fix-divide"
      use:resizeObserver
    >
      {@render itemSnippet(item.index)}
    </div>
  {/each}
</div>

<style>
  .fix-divide:nth-child(2) {
    border-top: 0;
  }
</style>
