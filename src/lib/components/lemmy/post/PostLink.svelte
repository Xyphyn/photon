<script lang="ts">
  import Link, { parseURL } from '$lib/components/input/Link.svelte'
  import { Material } from 'mono-svelte'
  import { Icon, Link as LinkIcon } from 'svelte-hero-icons'

  export let url: string
  export let thumbnail_url: string | undefined = undefined
  export let nsfw: boolean = false
  export let embed_title: string | undefined = undefined
  export let embed_description: string | undefined = undefined
  export let compact: boolean = false

  $: richURL = parseURL(url)
</script>

{#if embed_title && !compact}
  <Material class="flex flex-row gap-4">
    <div class="flex flex-col gap-2">
      {#if richURL}
        <Link
          href={url}
          class="text-slate-600 dark:text-zinc-400 inline-flex items-center gap-1 text-xs"
        >
          <Icon src={LinkIcon} size="12" mini slot="icon" />
          {richURL.hostname}
        </Link>
      {/if}
      <a href={url} class="font-medium text-base hover:underline">
        {embed_title}
      </a>
      {#if embed_description}
        <p
          class="text-sm text-transparent bg-clip-text bg-gradient-to-b
        from-slate-700 dark:from-zinc-400
        via-slate-700 dark:via-zinc-400
        to-slate-700/0 dark:to-zinc-400/0"
        >
          {embed_description.slice(0, 300)}
        </p>
      {/if}
    </div>
    {#if thumbnail_url}
      <a href={url} class="ml-auto max-w-[150px] w-full flex-shrink">
        <img
          src={thumbnail_url}
          class="rounded-lg max-w-[200px] w-full h-full max-h-24 object-cover bg-slate-200 dark:bg-zinc-800"
          width={600}
          height={400}
          alt=""
          class:blur-3xl={nsfw}
        />
      </a>
    {/if}
  </Material>
{:else if thumbnail_url}
  <Link href={url} highlight nowrap />
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
