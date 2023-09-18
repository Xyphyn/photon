<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'

  export let url: string
  export let thumbnail_url: string | undefined = undefined
  export let nsfw: boolean = false
</script>

<Link href={url} highlight nowrap />

{#if thumbnail_url}
  <a href={url}>
    <img
      src={thumbnail_url}
      class="rounded-md max-w-[300px] w-full h-auto aspect-video object-cover bg-slate-200 dark:bg-zinc-800"
      width={600}
      height={400}
      alt=""
      class:blur-3xl={nsfw}
    />
  </a>
{/if}
