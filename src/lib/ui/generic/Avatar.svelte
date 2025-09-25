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
    [2, 3, 6, -1].map((n) => optimizeUrl(url, (res || width) * n)),
  )
</script>

{#if optimizedURLs[0] != undefined}
  <img
    {...rest}
    loading="lazy"
    srcset="{optimizedURLs[0]} 1x, {optimizedURLs[1]} 2x, {optimizedURLs[2]} 4x, {optimizedURLs[3]} 6x"
    src={optimizedURLs[0]}
    alt=""
    {width}
    {title}
    class={[
      'aspect-square object-cover overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-900',
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
      backgroundType: ['gradientLinear'],
      fontWeight: 800,
      randomizeIds: true,
      chars: 1,
      scale: 125,
      textColor: ['fff', '000'],
      backgroundColor: [
        '7B68EE',
        'FF6347',
        '20B2AA',
        'DDA0DD',
        'F0E68C',
        'FF1493',
        '4682B4',
        '32CD32',
        'FFB6C1',
        '8B4513',
        '00CED1',
        '9370DB',
        'FFA500',
        '2E8B57',
        'DC143C',
        'BA55D3',
        '708090',
        'ADFF2F',
        'CD853F',
        '48D1CC',
      ],
    }).toString()}
  </div>
{/if}
