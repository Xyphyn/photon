<script lang="ts">
  import Link, { parseURL } from '$lib/components/input/Link.svelte'
  import { Button, Material } from 'mono-svelte'
  import { Icon, Link as LinkIcon } from 'svelte-hero-icons'
  import { optimizeImageURL } from './helpers'

  export let url: string
  export let thumbnail_url: string | undefined = undefined
  export let nsfw: boolean = false
  export let embed_title: string | undefined = undefined
  export let embed_description: string | undefined = undefined
  export let compact: boolean = false

  $: richURL = parseURL(url)
</script>

<!-- 
  @component
  For embed-type posts. Displays embed card or a compact link.
-->
{#if embed_title && !compact}
  <Material
    color="distinct"
    class="flex flex-col-reverse sm:flex-row overflow-hidden gap-4"
  >
    <div class="flex flex-col gap-2">
      {#if richURL}
        <Link
          href={url}
          target="_blank"
          class="text-slate-600 dark:text-zinc-400 inline-flex items-center gap-1 text-xs"
        >
          <Icon src={LinkIcon} size="12" mini slot="icon" />
          {richURL.hostname}
        </Link>
      {/if}
      <a
        href={url}
        target="_blank"
        class="font-medium text-base hover:underline"
      >
        {embed_title}
      </a>
      {#if embed_description}
        <p class="text-sm">
          {embed_description.slice(0, 300)}{embed_description.length > 300
            ? '...'
            : ''}
        </p>
      {/if}
    </div>
    {#if thumbnail_url}
      <a
        href={url}
        target="_blank"
        class="-m-4 mb-auto sm:-mb-4 sm:ml-auto flex-shrink-0 sm:w-1/3 sm:max-w-60"
      >
        <picture>
          <source
            srcset={optimizeImageURL(thumbnail_url, 256)}
            media="(max-width: 256px)"
          />
          <source
            srcset={optimizeImageURL(thumbnail_url, 512)}
            media="(max-width: 512px)"
          />
          <source
            srcset={optimizeImageURL(thumbnail_url, 1024)}
            media="(max-width: 1024px)"
          />
          <img
            src={optimizeImageURL(thumbnail_url, -1)}
            class="object-cover w-full sm:max-w-96 h-48 sm:h-72 bg-slate-200 dark:bg-zinc-800"
            width={600}
            height={400}
            alt={embed_title}
            class:blur-3xl={nsfw}
          />
        </picture>
      </a>
    {/if}
  </Material>
{:else}
  <Button
    href={url}
    target="_blank"
    class="text-slate-900 dark:text-zinc-300 inline-flex items-center gap-1 text-xs overflow-hidden w-max max-w-full"
    size="sm"
    color="ghost"
    rounding="pill"
  >
    <Icon src={LinkIcon} size="14" mini slot="prefix" class="flex-shrink-0" />
    {#if richURL}
      <div class="flex max-w-full overflow-hidden font-medium">
        {richURL.hostname}
        {#if richURL.pathname != '/'}
          <span
            class="text-slate-500 dark:text-zinc-500 whitespace-nowrap font-normal"
          >
            {richURL.pathname}
          </span>
        {/if}
      </div>
    {:else}
      {url}
    {/if}
  </Button>
  {#if thumbnail_url && !compact}
    <a href={url} target="_blank">
      <img
        src={optimizeImageURL(thumbnail_url, 256)}
        class="rounded-md max-w-72 w-full h-auto aspect-video object-cover bg-slate-200 dark:bg-zinc-800"
        width={600}
        height={400}
        alt={embed_title ?? 'Embed prevented alt text'}
        class:blur-3xl={nsfw}
      />
    </a>
  {/if}
{/if}
