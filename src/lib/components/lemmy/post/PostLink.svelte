<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import { Icon, Link as LinkIcon } from 'svelte-hero-icons'

  export let url: string
  export let thumbnail_url: string
  export let nsfw: boolean = false
  let loaded = false;
</script>
<style>
    max-w-xxl {
        max-width: 46rem;
    }
</style>

<Link href={url} highlight nowrap />


<a
    href="{url}"
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
>
    <img
        src="{thumbnail_url}"
        loading="lazy"
        class="max-w-2xl ml-auto mr-auto object-cover rounded-md  z-30 opacity-0 transition-opacity duration-300"
        
        class:opacity-100={loaded}
        on:load={() => (loaded = true)}
        class:blur-3xl={nsfw}
    />

    
</a>

