<script lang="ts" generics="T">
  import { browser } from '$app/environment'
  import { onDestroy, untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { innerHeight } from 'svelte/reactivity/window'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    estimatedHeight?: number
    overscan?: number
    item: Snippet<[number]>
    restore?: {
      itemHeights: (number | null)[]
    }
    initialOffset?: number
  }

  let {
    items,
    estimatedHeight = 100,
    overscan = 5,
    item: itemSnippet,
    initialOffset = 0,
    restore = $bindable(),
    ...rest
  }: Props = $props()

  export function scrollToIndex(index: number, useWindow: boolean = false) {
    scrollPosition = cumulativeItemHeights[index] - initialOffset || 0
    if (useWindow && browser)
      window.scrollTo({ behavior: 'instant', top: scrollPosition })
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

  let scrollPosition = $state(0)
  let viewportHeight = $state(0)
  let visibleItems = $state<{ index: number; offset: number }[]>([])

  $effect.pre(() => {
    if (virtualListEl) {
      untrack(() => {
        visibleItems = updateVisibleItems()
      })
    }
  })

  $effect.pre(() => {
    if (items.length > itemHeights.length) {
      const missing = items.length - itemHeights.length
      itemHeights = [...itemHeights, ...Array(missing).fill(null)]
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
    const scrollTop = scrollPosition - initialOffset

    let newVisibleItems: { index: number; offset: number }[] = []

    const firstIndex = findFirstVisibleIndex(scrollTop, cumulativeItemHeights)

    let i = firstIndex
    let offset = i == 0 ? 0 : cumulativeItemHeights[i - 1]

    while (i < items.length && offset < scrollTop + viewportHeight + overscan) {
      newVisibleItems.push({ index: i, offset: offset })
      const height = itemHeights[i] || estimatedHeight
      offset += height
      i++
    }

    return newVisibleItems ?? []
  }

  function resizeObserver(node: HTMLElement) {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const indexAttr = node.getAttribute('data-index')
        if (indexAttr === null) continue
        const index = Number(indexAttr)
        if (isNaN(index)) continue

        const newHeight = entry.contentRect.height
        if (itemHeights[index] !== newHeight) {
          itemHeights[index] = newHeight
          visibleItems = updateVisibleItems()
        }
      }
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

  let oldScroll = $state(0)
  $effect(() => {
    if (Math.abs(scrollPosition - oldScroll) > estimatedHeight) {
      visibleItems = updateVisibleItems()
      oldScroll = scrollPosition
    }
  })
</script>

<svelte:window bind:scrollY={scrollPosition} />

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
