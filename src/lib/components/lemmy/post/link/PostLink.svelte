<script lang="ts">
  import Link, { parseURL } from '$lib/components/input/Link.svelte'
  import { Button, Material } from 'mono-svelte'
  import {
    CheckBadge,
    ChevronDown,
    Icon,
    Link as LinkIcon,
  } from 'svelte-hero-icons'
  import { optimizeImageURL } from '../helpers'
  import { t } from '$lib/translations'
  import type { View } from '$lib/settings.svelte'

  interface Props {
    url: string
    thumbnail_url?: string | undefined
    nsfw?: boolean
    embed_title?: string | undefined
    embed_description?: string | undefined
    view?: View
  }

  let {
    url,
    thumbnail_url = undefined,
    nsfw = false,
    embed_title = undefined,
    embed_description = undefined,
    view = 'cozy',
  }: Props = $props()

  let richURL = $derived(parseURL(url))
</script>

<!-- 
  @component
  For embed-type posts. Displays embed card or a compact link.
-->
{#if embed_title && view != 'compact'}
  <a href={url} class="group/link">
    <Material
      color="distinct"
      class="flex flex-col-reverse sm:flex-row
    overflow-hidden gap-4 embed-card z-0 relative
    dark:border-t-zinc-800 border-opacity-80 max-w-full
    dark:bg-zinc-950 group-hover/link:bg-slate-50 group-hover/link:dark:bg-zinc-900 transition-colors"
      rounding="2xl"
      element="article"
    >
      {#if thumbnail_url}
        <img
          src={optimizeImageURL(thumbnail_url, 64)}
          alt=""
          class="-z-10 absolute w-full object-cover h-full opacity-10 brightness-150
        dark:brightness-90 dark:opacity-20 blur-2xl -inset-px"
        />
      {/if}
      <div class="flex flex-col gap-2">
        {#if richURL}
          <div
            class="text-slate-600 dark:text-zinc-400 inline-flex items-center gap-1 text-xs font-medium"
          >
            {richURL.hostname}
          </div>
        {/if}
        <p class="font-medium text-base">{embed_title}</p>
      </div>
      {#if thumbnail_url}
        <picture
          class="-m-4 mb-auto sm:-mb-4 sm:ml-auto flex-shrink-0 sm:w-1/3 sm:max-w-60"
        >
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
            class="object-cover w-full sm:max-w-96 h-32 sm:min-h-16 bg-slate-200 dark:bg-zinc-800"
            width={600}
            height={400}
            alt=" "
            class:blur-3xl={nsfw}
          />
        </picture>
      {/if}
    </Material>
  </a>
{:else}
  <Button
    href={url}
    target="_blank"
    class="text-slate-900 dark:text-zinc-300 items-center
    text-xs overflow-hidden max-w-full block flex-shrink self-start w-max"
    size="xs"
    color="ghost"
    rounding="pill"
  >
    {#if richURL}
      <div
        class="flex max-w-full overflow-hidden font-medium self-start justify-self-start w-max"
      >
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
{/if}
