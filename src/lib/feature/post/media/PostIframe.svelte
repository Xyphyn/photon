<script lang="ts" module>
  import { settings } from '$lib/app/settings.svelte'
  import Blobs from '$lib/ui/generic/Blobs.svelte'
  import {
    Icon,
    type IconSource,
    Play,
    PuzzlePiece,
    VideoCamera,
  } from 'svelte-hero-icons/dist'
  import { type IframeType, optimizeImageURL } from '../helpers'

  const youtubeDomain = (place: 'youtube' | 'invidious' | 'piped') => {
    switch (place) {
      case 'youtube': {
        return 'www.youtube-nocookie.com'
      }
      case 'invidious': {
        return settings.embeds.invidious || 'yewtu.be'
      }
      case 'piped': {
        return settings.embeds.piped || 'piped.video'
      }
    }
  }

  function youtubeVideoID(url: string): string | null {
    const regex =
      /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    const match = url.match(regex)

    if (match && match[1]) {
      return match[1]
    }

    return null
  }
</script>

<script lang="ts">
  const urlToEmbed = (inputUrl: string) => {
    if (type == 'video') {
      return inputUrl
    }

    if (type == 'youtube') {
      const url = new URL(inputUrl)

      const videoID = youtubeVideoID(inputUrl)

      if (videoID) {
        const embedUrl = new URL(
          `https://${youtubeDomain(settings.embeds.youtube)}/embed/${videoID}`,
        )

        embedUrl.searchParams.set('start', url.searchParams.get('t') ?? '')

        url.searchParams.forEach((value, key) => {
          embedUrl.searchParams.set(key, value)
        })

        if (autoplay) embedUrl.searchParams.set('autoplay', '1')

        return embedUrl.toString()
      }
    }

    return ''
  }

  const typeData = (
    type: IframeType,
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
      case 'video': {
        return {
          icon: VideoCamera,
          text: 'Video',
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

  interface Props {
    type?: IframeType
    thumbnail?: string | undefined
    url: string
    opened?: boolean
    autoplay?: boolean
    title?: string
  }

  let {
    type = 'none',
    thumbnail = undefined,
    url,
    title,
    opened = $bindable(!settings.embeds.clickToView),
    autoplay = settings.embeds.clickToView,
  }: Props = $props()

  let data = $derived(typeData(type))
  let embedUrl = $derived(urlToEmbed(url))
</script>

<!-- 
  @component
  Displays a video file or embedded video iframe.
-->
<div class="iframe-container">
  {#if opened}
    {#if type == 'video'}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video {autoplay} controls>
        <source src={url} />
      </video>
    {:else}
      <iframe
        src={embedUrl}
        title="Embed player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    {/if}
  {:else}
    <button onclick={() => (opened = true)} class="iframe-preview">
      <div role="presentation" class="preview-start">
        <div class="start-button">
          <Icon src={Play} size="32" mini />
        </div>
      </div>
      {#if thumbnail}
        <img
          src={optimizeImageURL(thumbnail, 512)}
          class="absolute top-0 left-0 -z-10 w-full object-cover h-full mask-b-from-0 brightness-75"
          alt=""
        />
      {:else}
        <div class="absolute inset-0 w-full h-full scale-200 -z-10 opacity-50">
          <Blobs seed={title ?? data.text} />
        </div>
      {/if}
      <Icon src={data.icon} solid size="48" />
      <h1 class="font-display text-3xl font-medium text-left">
        {title ?? data.text}
      </h1>
      <div class="text-slate-600 dark:text-zinc-400">
        {URL.parse?.(url)?.hostname ?? data.text}
      </div>
    </button>
  {/if}
</div>

<style>
  @reference '../../../../app.css';

  .iframe-container {
    border-radius: var(--radius-2xl);
    aspect-ratio: 16 / 9;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--color-slate-200);

    @variant dark {
      border-color: var(--color-zinc-900);
    }

    & > * {
      width: 100%;
      height: 100%;
    }

    .iframe-preview {
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: end;
      padding: calc(var(--spacing) * 6);
      gap: calc(var(--spacing) * 1);
    }

    .preview-start {
      width: 100%;
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }

    .start-button {
      width: calc(var(--spacing) * 16);
      height: calc(var(--spacing) * 16);
      border-radius: 9999px;
      background-color: --alpha(var(--color-slate-100) / 50%);
      display: grid;
      place-items: center;
      backdrop-filter: blur(var(--blur-sm));
      cursor: pointer;
      position: relative;
      box-shadow:
        0 1px 3px 0 rgb(0 0 0 / 0.1),
        0 1px 2px -1px rgb(0 0 0 / 0.1);
      transition:
        background-color 300ms var(--ease-cubic),
        transform 300ms var(--ease-cubic);

      @variant hover {
        background-color: --alpha(var(--color-slate-200) / 50%);
      }

      @variant dark {
        background-color: --alpha(var(--color-zinc-900) / 50%);
        @variant hover {
          background-color: --alpha(var(--color-zinc-800) / 50%);
        }
      }

      @variant active {
        transform: scale(93%);
      }
    }
  }
</style>
