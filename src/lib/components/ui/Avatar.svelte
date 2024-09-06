<script lang="ts">
  import { findClosestNumber } from '$lib/util.js'
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'

  const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512]

  export let url: string | undefined
  export let alt: string = ''
  export let title: string = ''
  export let circle: boolean = true

  export let width: number
  export let res: number | undefined = undefined

  const optimizeUrl = (
    url: string | undefined,
    res: number
  ): string | undefined => {
    if (url === undefined) return

    try {
      const urlObj = new URL(url)
      urlObj.searchParams.append('format', 'webp')
      if (res > -1) {
        urlObj.searchParams.append(
          'thumbnail',
          findClosestNumber(sizes, res).toString()
        )
      }

      return urlObj.toString()
    } catch (e) {
      return undefined
    }
  }

  $: optimizedURLs = [2, 3, 6, -1].map((n) =>
    optimizeUrl(url, (res || width) * n)
  )
</script>

{#if optimizedURLs[0] != undefined}
  <img
    loading="lazy"
    srcset="{optimizedURLs[0]} 1x, {optimizedURLs[1]} 2x, {optimizedURLs[2]} 4x, {optimizedURLs[3]} 6x"
    src={optimizedURLs[0]}
    {alt}
    {width}
    {title}
    class="aspect-square object-cover overflow-hidden {$$props.class} flex-shrink-0"
    style="width: {width}px; height: {width}px;"
    class:rounded-full={circle}
    class:rounded-md={!circle}
  />
{:else}
  <div
    style="width: {width}px; height: {width}px;"
    class="aspect-square object-cover overflow-hidden {$$props.class} flex-shrink-0"
    class:rounded-full={circle}
    class:rounded-md={!circle}
  >
    {@html createAvatar(initials, {
      seed: alt,
    }).toString()}
  </div>
{/if}
