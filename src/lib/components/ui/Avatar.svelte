<script lang="ts">
  import { findClosestNumber } from '$lib/util.js'
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'

  const sizes = [48, 64, 128, 256, 512]

  export let url: string | undefined
  export let alt: string = ''

  export let width: number
</script>

{#if url}
  <img
    src="{url}?format=webp&thumbnail={findClosestNumber(sizes, width)}"
    {alt}
    {width}
    loading="lazy"
    class="rounded-full aspect-square object-cover overflow-hidden"
  />
{:else}
  <div
    style="width: {width}px; height: {width}px;"
    class="rounded-full aspect-square object-cover overflow-hidden"
  >
    {@html createAvatar(initials, {
      seed: alt,
    }).toString()}
  </div>
{/if}
