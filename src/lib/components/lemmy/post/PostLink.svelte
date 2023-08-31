<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import type { PostType } from '$lib/ui/image.js'
  import { Icon, VideoCamera } from 'svelte-hero-icons'

  export let url: string
  export let goto: string | undefined = undefined
  export let thumbnail_url: string | undefined = undefined
  export let nsfw: boolean = false
  export let type: PostType | undefined = undefined

  let loaded = false
</script>

<Link href={url} highlight nowrap />

<a
  href={goto ? goto : url}
  class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-md"
  data-sveltekit-preload-data="off"
>
  <div class="ml-auto mr-auto max-w-md">
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      src={thumbnail_url}
      loading="lazy"
      class="max-w-md ml-auto mr-auto object-cover rounded-md z-30 opacity-0 transition-opacity duration-300"
      class:opacity-100={loaded}
      on:load={() => (loaded = true)}
      class:blur-3xl={nsfw}
    />
    {#if type}
      <div class="flex flex-row gap-2 bottom-0 right-0 m-2 absolute z-50">
        {#if type == 'video' || type == 'youtube'}
          <Icon
            class="bg-slate-100 dark:bg-zinc-900 border rounded-full p-1.5 dark:border-zinc-700 border-slate-300"
            src={VideoCamera}
            solid
            size="28"
          />
        {/if}
      </div>
    {/if}
  </div>
</a>
