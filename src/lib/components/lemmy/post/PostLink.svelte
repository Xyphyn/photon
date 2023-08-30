<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import { Icon, Link as LinkIcon } from 'svelte-hero-icons'

  export let url: string
  export let thumbnail_url: string
  export let nsfw: boolean = false
  let loaded = false;
</script>

<Link href={url} highlight nowrap />

<a
    href="{url}"
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
>
    <picture class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full">
        <source
            srcset="{thumbnail_url}"
            media="(max-width: 1024px)"
        />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
            src="{thumbnail_url}"
            loading="lazy"
            class="ml-auto mr-auto object-cover rounded-md h-auto z-30 opacity-0 transition-opacity duration-300"
            class:opacity-100={loaded}
            width={768}
            height={300}
            on:load={() => (loaded = true)}
        />
    </picture>
</a>

<!---
<a href={url}>
  <img
    src={thumbnail_url}
    
    class="rounded-md overflow-hidden max-h-[min(50vh,500px)] max-w-lg ml-auto mr-auto h-auto"
    width={600}
    height={400}
    alt=""
    class:blur-3xl={nsfw}
  />
</a>
--->
<!---class="rounded-md max-w-lg ml-auto mr-auto h-auto aspect-video object-cover bg-slate-200 dark:bg-zinc-800"--->
