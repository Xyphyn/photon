<script lang="ts">
  import { findClosestNumber } from '$lib/util.js'
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'

  const sizes = [48, 64, 128, 256, 512]

  export let url: string | undefined
  export let alt: string = ''
  export let title: string = ''
  export let circle: boolean = true

  export let width: number
  export let res: number | undefined = undefined

  const optimizeUrl = (url: string | undefined): string | undefined => {
    if (url === undefined) return

    const urlObj = new URL(url)
    urlObj.searchParams.append('format', 'webp')
    urlObj.searchParams.append(
      'thumbnail',
      findClosestNumber(sizes, res || width).toString()
    )

    return urlObj.toString()
  }

  $: optimizedURL = optimizeUrl(url)
</script>

{#if optimizedURL}
  <img
    src={optimizedURL}
    {alt}
    {width}
    {title}
    loading="lazy"
    class="aspect-square object-cover overflow-hidden {$$props.class}"
    style="width: {width}px; height: {width}px;"
    class:rounded-full={circle}
    class:rounded-md={!circle}
  />
{:else}
  <div
    style="width: {width}px; height: {width}px;"
    class="aspect-square object-cover overflow-hidden {$$props.class}"
    class:rounded-full={circle}
    class:rounded-md={!circle}
  >
    {@html createAvatar(initials, {
      seed: alt,
    }).toString()}
  </div>
{/if}
