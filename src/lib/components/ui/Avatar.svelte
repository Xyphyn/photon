<script lang="ts">
  import { findClosestNumber } from '$lib/util.svelte.js'
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'
  import type { ClassValue } from 'svelte/elements'

  const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512]

  const optimizeUrl = (
    url: string | undefined,
    res: number,
  ): string | undefined => {
    if (url === undefined) return

    try {
      const urlObj = new URL(url)
      urlObj.searchParams.append('format', 'webp')
      if (res > -1) {
        urlObj.searchParams.append(
          'thumbnail',
          findClosestNumber(sizes, res).toString(),
        )
      }

      return urlObj.toString()
    } catch {
      return undefined
    }
  }

  interface Props {
    url: string | undefined
    alt?: string
    title?: string
    circle?: boolean
    width: number
    res?: number | undefined
    style?: string
    class?: ClassValue
  }

  let {
    url,
    alt = '',
    title = '',
    circle = true,
    width,
    res = undefined,
    style = '',
    class: clazz = '',
    ...rest
  }: Props = $props()

  let optimizedURLs = $derived(
    [2, 3, 6, -1].map(n => optimizeUrl(url, (res || width) * n)),
  )
</script>

{#if optimizedURLs[0] != undefined}
  <img
    {...rest}
    loading="lazy"
    srcset="{optimizedURLs[0]} 1x, {optimizedURLs[1]} 2x, {optimizedURLs[2]} 4x, {optimizedURLs[3]} 6x"
    src={optimizedURLs[0]}
    {alt}
    {width}
    {title}
    class={[
      'aspect-square object-cover overflow-hidden shrink-0',
      circle ? 'rounded-full' : 'rounded-lg',
      clazz,
    ]}
    style="width: {width}px; height: {width}px; {style}"
  />
{:else}
  <div
    style="width: {width}px; height: {width}px;"
    class={[
      'aspect-square object-cover overflow-hidden shrink-0',
      circle ? 'rounded-full' : 'rounded-lg',
      clazz,
    ]}
  >
    {@html createAvatar(initials, {
      seed: alt,
    }).toString()}
  </div>
{/if}
