<script lang="ts" generics="T">
  import { debounce } from 'mono-svelte/util/time'
  import { untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    estimatedHeight?: number
    overscan?: number
    item: Snippet<[T, number, Function]>
    initialOffset?: number
  }

  let {
    items,
    estimatedHeight = 100,
    overscan = 5,
    item: itemSnippet,
    initialOffset = 0,
    ...rest
  }: Props = $props()

  let virtualListEl = $state<HTMLElement>()
  let itemHeights = $state<(number | null)[]>(Array(items.length).fill(null))
  let scrollPosition = $state(0)
  let viewportHeight = $state(0)
  let visibleItems = $state<{ index: number; offset: number }[]>([])

  $effect(() => {
    if (items || virtualListEl) {
      visibleItems = updateVisibleItems()
    }
  })

  function updateVisibleItems() {
    if (!virtualListEl) return []

    viewportHeight = virtualListEl.offsetHeight
    const scrollTop = scrollPosition

    let newVisibleItems: { index: number; offset: number }[] = []
    let currentOffset = 0
    let visibleCount = 0

    for (let i = 0; i < items.length; i++) {
      const itemHeight = itemHeights[i] || estimatedHeight

      if (
        currentOffset + itemHeight > scrollTop - initialOffset &&
        currentOffset < scrollTop - initialOffset + viewportHeight
      ) {
        newVisibleItems.push({ index: i, offset: currentOffset })
        visibleCount++
      }

      currentOffset += itemHeight

      if (visibleCount > items.length) break
    }

    return newVisibleItems ?? []
  }

  function measureItem(element: HTMLElement) {
    const index = Number(element.getAttribute('data-index'))
    if (isNaN(index)) return estimatedHeight

    if (element && itemHeights[index] !== element.offsetHeight) {
      itemHeights[index] = element.offsetHeight
    }
  }

  function onscroll() {
    scrollPosition = window.scrollY
    visibleItems = updateVisibleItems()
  }
</script>

<svelte:window onscroll={() => debounce(onscroll, 300)} />

<div
  bind:this={virtualListEl}
  style="position: relative; height: {itemHeights.reduce(
    (prev, curr) => (prev || estimatedHeight) + (curr || estimatedHeight),
    0,
  )}px; width: 100%;"
  {...rest}
>
  {#each visibleItems as item (item.index)}
    <div
      data-index={item.index}
      style="position: absolute; top: {item.offset}px; width: 100%;"
      use:measureItem
    >
      {@render itemSnippet(items[item.index], item.index, () => {})}
    </div>
  {/each}
</div>
