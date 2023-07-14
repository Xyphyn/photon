<script lang="ts">
  import { createAvatar } from '@dicebear/core'
  import * as initials from '@dicebear/initials'

  export let url: string | undefined
  export let alt: string = ''

  export let width: number
</script>

{#if url}
  <img
    src="{url}?format=webp&thumbnail={width * 2}"
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
