<script lang="ts">
  import { findClosestNumber } from '$lib/app/util.svelte'
  import { optimizeImageURL } from '$lib/feature/post'
  import type { ClassValue } from 'svelte/elements'

  const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512]

  const colors = [
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
  ]

  function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }

  function createInitialAvatar(seed: string): string {
    const hash = simpleHash(seed)
    const color1 = colors[hash % colors.length]
    const color2 = colors[(hash + 7) % colors.length]
    const initial = (seed[0] || '?').toUpperCase()
    const textColor = hash % 2 === 0 ? 'fff' : '000'

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="bg${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${color1}"/>
          <stop offset="100%" style="stop-color:#${color2}"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg${hash})"/>
      <text x="50" y="50" dy=".35em" text-anchor="middle" fill="#${textColor}" font-size="50" font-weight="800" font-family="sans-serif">${initial}</text>
    </svg>`
  }

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
    circle?: boolean | null
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
    [1.5, 3].map((n) => url && optimizeImageURL(url, (res || width) * n)),
  )
</script>

{#if url && optimizedURLs[0] != undefined}
  <img
    {...rest}
    loading="lazy"
    srcset="{optimizedURLs[0]} 1x, {optimizedURLs[1]} 2x"
    src={optimizedURLs[0]}
    alt=""
    {width}
    {title}
    class={[
      'aspect-square object-cover overflow-hidden shrink-0',
      circle === true ? 'rounded-full' : circle === false ? 'rounded-lg' : '',

      clazz,
    ]}
    style="width: {width}px; height: {width}px; {style}"
  />
{:else}
  <div
    style="width: {width}px; height: {width}px;"
    class={[
      'aspect-square object-cover overflow-hidden shrink-0',
      circle === true ? 'rounded-full' : circle === false ? 'rounded-lg' : '',
      clazz,
    ]}
  >
    {@html createInitialAvatar(alt)}
  </div>
{/if}
