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
  import { Icon, PuzzlePiece } from 'svelte-hero-icons'
  import type { IframeType, MediaType } from '../helpers'
  import { userSettings } from '$lib/settings'

  export let type: IframeType = 'none'
  export let url: string
  let opened = false

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
    <div
      class="absolute blur-3xl -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-green-800 via-blue-900 via-20% to-red-700"
    />
    <Icon src={PuzzlePiece} solid size="48" />
    <h1 class="font-bold text-xl">Embed</h1>
    <p>Click to view this content.</p>
  </button>
{/if}
