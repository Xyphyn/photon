<script lang="ts">
  export let instance: string
  export let post: object
  export let userSettings: object
  export let loaded = false
</script>


<a
    href="/post/{instance}/{post.post.id}"
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
    aria-label={post.post.name}
>
    <picture class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full">
        <source
            srcset="{post.post.url}?thumbnail=256&format=webp"
            media="(max-width: 256px)"
        />
        <source
            srcset="{post.post.url}?thumbnail=512&format=webp"
            media="(max-width: 512px)"
        />

        <source
            srcset="{post.post.url}?thumbnail=768&format=webp"
            media="(max-width: 768px)"
        />

        <source
            srcset="{post.post.url}?format=webp"
            media="(max-width: 1024px)"
        />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
            src="{post.post.url}?format=webp"
            loading="lazy"
            class="ml-auto mr-auto object-cover rounded-md h-auto z-30 opacity-0 transition-opacity duration-300"
            class:opacity-100={loaded}
            class:blur-3xl={post.post.nsfw && $userSettings.nsfwBlur}
            on:load={() => (loaded = true)}
        />
    </picture>
</a>

