<script lang="ts">
  import { optimizeImageURL } from '$lib/feature/post'
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    url?: string
    alt?: string
    title?: string
    circle?: boolean | null
    width: number
    res?: number
    style?: string
    class?: ClassValue
  }

  let {
    url,
    alt = '',
    title = '',
    circle = true,
    width,
    res,
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
