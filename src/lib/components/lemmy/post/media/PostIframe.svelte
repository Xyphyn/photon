<script lang="ts" context="module">
  const youtubeDomain = (place: 'youtube' | 'invidious' | 'piped') => {
    switch (place) {
      case 'youtube': {
        return 'www.youtube-nocookie.com'
      }
      case 'invidious': {
        return 'vid.puffyan.us'
      }
      case 'piped': {
        return 'piped.video'
      }
    }
  }
</script>

<script lang="ts">
  import {
    Icon,
    PuzzlePiece,
    VideoCamera,
    type IconSource,
  } from 'svelte-hero-icons'
  import type { IframeType, MediaType } from '../helpers'
  import { userSettings } from '$lib/settings'

  export let type: IframeType = 'none'
  export let thumbnail: string | undefined = undefined
  export let url: string
  export let opened = !$userSettings.embeds.clickToView

  const urlToEmbed = (inputUrl: string) => {
    if (type == 'youtube') {
      const url = new URL(inputUrl)
      const videoID = url.searchParams.get('v')
      url.searchParams.delete('v')

      return `https://${youtubeDomain(
        $userSettings.embeds.youtube
      )}/embed/${videoID}?${url.searchParams.toString()}`
    }

    return ''
  }

  const typeData = (
    type: IframeType
  ): {
    icon: IconSource
    text: string
  } => {
    switch (type) {
      case 'youtube': {
        return {
          icon: VideoCamera,
          text: 'YouTube Video',
        }
      }
      default: {
        return {
          icon: PuzzlePiece,
          text: 'Embed',
        }
      }
    }
  }

  $: data = typeData(type)
  $: embedUrl = urlToEmbed(url)
</script>

{#if opened}
  <iframe
    src={embedUrl}
    title="Embed player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    class="aspect-video rounded-xl dark:bg-zinc-900"
  />
{:else}
  <button
    on:click={() => (opened = true)}
    class="aspect-video w-full h-full z-0 overflow-hidden relative rounded-xl flex flex-col gap-2 items-center justify-center"
  >
    {#if thumbnail}
      <img
        src={thumbnail}
        class="absolute top-0 left-0 -z-10 brightness-[25%] w-full object-cover h-full"
        alt=""
      />
    {:else}
      <div
        class="absolute blur-3xl -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-green-800 via-blue-900 via-20% to-red-700"
      />
    {/if}
    <Icon src={data.icon} solid size="48" />
    <h1 class="font-bold text-xl">{data.text}</h1>
    <p>Click to view this content.</p>
  </button>
{/if}
