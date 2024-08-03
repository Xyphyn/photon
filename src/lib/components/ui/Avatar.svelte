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

  const optimizeUrl = (url: string | undefined): string | undefined => {
    if (url === undefined) return

    try {
      const urlObj = new URL(url)
      urlObj.searchParams.append('format', 'webp')
      urlObj.searchParams.append(
        'thumbnail',
        findClosestNumber(sizes, (res || width) * 1.5).toString()
      )

      return urlObj.toString()
    } catch (e) {
      return undefined
    }
  }

  $: optimizedURL = optimizeUrl(url)
</script>

{#if optimizedURL}
  <img
    loading="lazy"
    src={optimizedURL}
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
