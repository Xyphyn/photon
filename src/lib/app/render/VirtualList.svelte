<script lang="ts" generics="T">
  import { browser } from '$app/environment'
  import { Expandable } from 'mono-svelte'
  import { debounce } from 'mono-svelte/util/time'
  import { type Snippet, onDestroy, onMount, untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { SvelteMap } from 'svelte/reactivity'
  import { innerHeight } from 'svelte/reactivity/window'
  import { settings } from '../settings.svelte'

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
    ...rest
  }: Props = $props()

  let initialRender = true
  let isUpdating = false // Guard against re-entrant updates

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

  let cumulativeItemHeights = $state<number[]>([])
  let totalHeight = $derived<number>(
    cumulativeItemHeights[cumulativeItemHeights.length - 1] || 0,
  )

  function updateCumulativeHeights(changedIndex?: number) {
    if (
      changedIndex !== undefined &&
      changedIndex < cumulativeItemHeights.length
    ) {
      // Incremental update
      let sum = changedIndex > 0 ? cumulativeItemHeights[changedIndex - 1] : 0

      for (let i = changedIndex; i < itemHeights.length; i++) {
        const height = itemHeights[i] || estimatedHeight
        sum += height
        cumulativeItemHeights[i] = sum
      }
    } else {
      // Full recalculation
      cumulativeItemHeights = new Array(itemHeights.length)
      let sum = 0
      for (let i = 0; i < itemHeights.length; i++) {
        const height = itemHeights[i] || estimatedHeight
        sum += height
        cumulativeItemHeights[i] = sum
      }
    }
  }

  let scrollY = $state(0)
  let viewportHeight = $state(0)
  let visibleItems = $state<{ index: number; offset: number }[]>([])

  // Track previous items length to detect actual changes
  let previousItemsLength = $state(items.length)

  // Handle items length changes
  $effect.pre(() => {
    const currentLength = items.length

    if (currentLength !== previousItemsLength) {
      if (currentLength > itemHeights.length) {
        const missing = currentLength - itemHeights.length
        itemHeights = [...itemHeights, ...Array(missing).fill(null)]
        updateCumulativeHeights(itemHeights.length - missing)
      } else if (currentLength < itemHeights.length) {
        itemHeights = itemHeights.slice(0, currentLength)
        updateCumulativeHeights()
      }

      previousItemsLength = currentLength

      // Schedule visible items update
      if (!isUpdating) {
        isUpdating = true
        requestAnimationFrame(() => {
          untrack(() => {
            visibleItems = updateVisibleItems()
            isUpdating = false
          })
        })
      }
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
    if (!virtualListEl || isUpdating) return visibleItems

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

  // ResizeObserver setup
  let heightUpdateBatch = new SvelteMap<number, number>()
  let heightUpdatePending = false
  let observer: ResizeObserver | undefined

  onMount(() => {
    if (browser) {
      const debouncedUpdate = debounce((entries: ResizeObserverEntry[]) => {
        if (isUpdating || heightUpdatePending) return

        for (const entry of entries) {
          const element = entry.target as HTMLElement
          const indexAttr = element.getAttribute('data-index')
          if (indexAttr === null) continue
          const index = Number(indexAttr)
          if (isNaN(index)) continue

          const newHeight = entry.contentRect.height
          const currentHeight = itemHeights[index] || estimatedHeight

          // Only update if height changed significantly
          if (Math.abs(currentHeight - newHeight) > 1) {
            heightUpdateBatch.set(index, newHeight)
          }
        }

        if (!heightUpdatePending && heightUpdateBatch.size > 0) {
          heightUpdatePending = true
          isUpdating = true

          requestAnimationFrame(() => {
            let minIndex = Infinity

            heightUpdateBatch.forEach((height, index) => {
              itemHeights[index] = height
              minIndex = Math.min(minIndex, index)
            })
            heightUpdateBatch.clear()

            updateCumulativeHeights(minIndex)

            if (!initialRender) {
              visibleItems = updateVisibleItems()
            }

            heightUpdatePending = false
            // Use another frame to ensure layout is complete
            requestAnimationFrame(() => {
              isUpdating = false
            })
          })
        }
      }, debounceResize)

      observer = new ResizeObserver((entries) => {
        debouncedUpdate(entries)
      })

      // Initial measurement and setup
      if (virtualListEl) {
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

        updateCumulativeHeights()

        untrack(() => {
          visibleItems = updateVisibleItems()
          initialRender = false
        })
      }
    }
  })

  function resizeObserver(node: HTMLElement) {
    observer?.observe(node)

    return {
      destroy() {
        observer?.unobserve(node)
      },
    }
  }

  onDestroy(() => {
    observer?.disconnect()
  })

  // Scroll position changes - with throttling
  let oldScroll = $state(0)
  let scrollUpdateScheduled = $state(false)

  $effect(() => {
    const currentScrollY = scrollY ?? 0

    // Read these without creating dependencies
    const prevScroll = untrack(() => oldScroll)
    const isScheduled = untrack(() => scrollUpdateScheduled)
    const updating = untrack(() => isUpdating)

    if (Math.abs(currentScrollY - prevScroll) > estimatedHeight / 2) {
      if (!isScheduled && !updating) {
        scrollUpdateScheduled = true

        // Use untrack for the callback to prevent reactivity issues
        const finalScrollY = currentScrollY
        requestAnimationFrame(() => {
          untrack(() => {
            visibleItems = updateVisibleItems()
            oldScroll = finalScrollY
            scrollUpdateScheduled = false
          })
        })
      }
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
  style="position: relative; height: {height || totalHeight}px;"
  {...rest}
  id="feed"
  onscroll={() => {
    if (!useWindow) scrollY = virtualListEl?.scrollTop ?? 0
  }}
>
  <div
    style="height: {cumulativeItemHeights[visibleItems?.[0]?.index - 1] ||
      0}px; border: 0 !important;"
  ></div>
  {#each visibleItems as item (item.index)}
    <div
      data-index={item.index}
      class="post-container fix-divide group/virtual"
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
      Rendering items: {visibleItems?.length} ({visibleItems?.[0]
        ?.index} - {visibleItems?.[visibleItems?.length - 1]?.index})
      Viewport height: {viewportHeight}
      Current scroll position: {scrollY}
      Container height: {totalHeight}
      Overscan: {overscan}
      Guess item height: {estimatedHeight}
      Item heights recorded: {itemHeights.filter((h) => h !== null)
        .length} / {itemHeights.length}
      Is updating: {isUpdating}
    </pre>
  </Expandable>
{/if}

<style>
  .fix-divide:nth-child(2) {
    border-top: 0;
  }
</style>
