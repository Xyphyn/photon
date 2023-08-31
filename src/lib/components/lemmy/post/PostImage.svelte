<script lang="ts">
  export let instance: string
  export let name: string
  export let url: string | boolean | undefined = undefined
  export let id: number
  export let nsfw: boolean
  export let nsfwBlur: boolean
  export let link: boolean
  export let fullResolution: boolean = false

  let loaded: boolean = false

  $: src = fullResolution
    ? `${url}?format=webp`
    : `${url}?thumbnail=768&format=webp`
</script>

{#if link}
  <a
    href="/post/{instance}/{id}"
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
    data-sveltekit-preload-data="off"
    aria-label={name}
  >
    <div class="ml-auto mr-auto max-w-3xl">
      <picture
        class="rounded-md overflow-hidden max-h-[min(50vh,200px)] w-full max-w-full"
      >
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

        <source srcset="{url}?format=webp" media="(max-width: 1024px)" />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          {src}
          loading="lazy"
          class="ml-auto mr-auto object-cover rounded-md h-auto z-30 max-h-[50vh] opacity-0 transition-opacity duration-300"
          class:opacity-100={loaded}
          class:blur-3xl={nsfw && nsfwBlur}
          width={700}
          height={500}
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
    <div class="ml-auto mr-auto mt-1 mb-1 max-w-4xl w-auto">
      <picture
        class="rounded-md overflow-hidden max-h-[min(50vh,500px)] max-w-full"
      >
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

        <source srcset="{url}?format=webp" media="(max-width: 1024px)" />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          {src}
          loading="lazy"
          class="ml-auto mr-auto object-cover rounded-md z-30 opacity-0 transition-opacity duration-300 h-auto w-full"
          class:opacity-100={loaded}
          class:blur-3xl={nsfw && nsfwBlur}
          width={600}
          height={500}
          on:load={() => (loaded = true)}
        />
      </picture>
    </div>
  </div>
{/if}
