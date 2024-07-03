<script lang="ts">
  import { onMount, afterUpdate } from 'svelte'
  import type { SvelteComponent } from 'svelte'

  interface VisibleItem<T> {
    item: T
    index: number
    top: number
  }

  export let items: any[] = []

  let containerHeight = 0
  let scrollTop = 0
  let itemHeights: number[] = []
  let visibleItems: VisibleItem<any>[] = []
  let totalHeight = 0
  let container: HTMLDivElement

  $: {
    let currentOffset = 0
    let startIndex = 0
    let endIndex = items.length - 1

    // Find the start index
    for (let i = 0; i < items.length; i++) {
      if (currentOffset + itemHeights[i] > scrollTop) {
        startIndex = Math.max(0, i)
        break
      }
      currentOffset += itemHeights[i]
    }

    // Find the end index
    currentOffset = 0
    for (let i = 0; i < items.length; i++) {
      if (currentOffset > scrollTop + containerHeight) {
        endIndex = Math.min(items.length - 1, i)
        break
      }
      currentOffset += itemHeights[i]
    }

    visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: itemHeights.slice(0, startIndex + index).reduce((a, b) => a + b, 0),
    }))

    console.log(visibleItems.length == items.length)

    totalHeight = itemHeights.reduce((a, b) => a + b, 0)
  }

  function handleScroll(event: Event): void {
    const target = event.target as HTMLDivElement
    scrollTop = target.scrollTop
  }

  function updateItemHeight(index: number, height: number): void {
    if (itemHeights[index] !== height) {
      itemHeights[index] = height
      itemHeights = itemHeights
    }
  }

  onMount(() => {
    containerHeight = container.clientHeight
    // Force an update
    items = items
  })

  afterUpdate(() => {
    // Measure item heights after render
    visibleItems.forEach(({ index }) => {
      const element = container.querySelector(
        `[data-index="${index}"]`
      ) as HTMLDivElement
      if (element) {
        updateItemHeight(index, element.offsetHeight)
      }
    })
  })
</script>

<svelte:window on:scroll={handleScroll} />

<div
  bind:this={container}
  style="height: 100%; width: 100%; overflow-x: hidden; overflow-y: scroll;"
>
  <div style="height: {totalHeight}px; position: relative;">
    {#each visibleItems as { item, index, top }}
      <div
        data-index={index}
        style="position: absolute; top: {top}px; width: 100%;"
      >
        <slot {item} {index} />
      </div>
    {/each}
  </div>
</div>
