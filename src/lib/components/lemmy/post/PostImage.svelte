<script lang="ts">
    export let instance: string
    export let name: string
    export let url: string|boolean
    export let id: string
    export let nsfw: boolean
    export let nsfwBlur: boolean
    export let link: boolean
    export let fullResolution: boolean

    let loaded:boolean = false
    
    let src: string
    if (fullResolution) {
        src = `${url}?format=webp`
    }
    else {
        src = `${url}?thumbnail=768&format=webp`
    }
</script>



{#if link}
<a
    href="/post/{instance}/{id}"
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
    aria-label={name}
>
    <div class="ml-auto mr-auto max-w-3xl">
        <picture class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full">
            <source
                srcset="{url}?thumbnail=256&format=webp"
                media="(max-width: 256px)"
            />
            <source
                srcset="{url}?thumbnail=512&format=webp"
                media="(max-width: 512px)"
            />

            <source
                srcset="{url}?thumbnail=768&format=webp"
                media="(max-width: 768px)"
            />

            <source
                srcset="{url}?format=webp"
                media="(max-width: 1024px)"
            />
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src="{src}"
                loading="lazy"
                class="ml-auto mr-auto object-cover rounded-md h-auto z-30 opacity-0 transition-opacity duration-300"
                class:opacity-100={loaded}
                class:blur-3xl={nsfw && nsfwBlur}
                on:load={() => (loaded = true)}
            />
        </picture>
    </div>
</a>

{:else}

<div
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
    aria-label={name}
>
    <div class="ml-auto mr-auto max-w-3xl">
        <picture class="rounded-md overflow-hidden max-h-[min(50vh,500px)] max-w-full">
            <source
                srcset="{url}?thumbnail=256&format=webp"
                media="(max-width: 256px)"
            />
            <source
                srcset="{url}?thumbnail=512&format=webp"
                media="(max-width: 512px)"
            />

            <source
                srcset="{url}?thumbnail=768&format=webp"
                media="(max-width: 768px)"
            />

            <source
                srcset="{url}?format=webp"
                media="(max-width: 1024px)"
            />
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src="{src}"
                loading="lazy"
                class="ml-auto mr-auto object-cover rounded-md h-auto z-30 opacity-0 transition-opacity duration-300"
                class:opacity-100={loaded}
                class:blur-3xl={nsfw && nsfwBlur}
                on:load={() => (loaded = true)}
            />
        </picture>
    </div>
</div>

{/if}

