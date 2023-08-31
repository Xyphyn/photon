<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import { userSettings } from '$lib/settings.js'

  export let url: string

  $: embedURL = parseVideoURL(url)

  const parseVideoURL = (url: string): string | undefined => {
    try {
      // Parse URLs to pick out video IDs to create embed URLs
      // YouTube
      if (
        url.startsWith('https://youtu.be') ||
        url.startsWith('https://youtube.com')
      ) {
        const pathname = new URL(url).pathname.replace('/', '')
        embedURL = 'https://www.youtube-nocookie.com/embed'

        if (pathname == 'watch') {
          return `${embedURL}/${new URL(url).searchParams.get('v')}`
        }
      }

      // Spotify
      // https://open.spotify.com/embed/track/2RUs0cO0KpvuZJ0J4hqFFC
      if (url.startsWith('https://open.spotify.com/embed')) return url

      if (url.startsWith('https://open.spotify.com/track')) {
        const trackID = new URL(url).pathname.replace('/track/', '')
        return `https://open.spotify.com/embed/track/${trackID}?theme=0`
      }

      if (url.startsWith('https://open.spotify.com/playlist')) {
        const trackID = new URL(url).pathname.replace('/playlist/', '')
        return `https://open.spotify.com/embed/playlist/${trackID}?theme=0`
      }

      if (url.startsWith('https://open.spotify.com/album')) {
        let trackID = new URL(url).pathname.replace('/album/', '')
        return `https://open.spotify.com/embed/album/${trackID}?theme=0`
      }
    } catch (err) {}
  }
</script>

<Link href={url} highlight nowrap />

{#if $userSettings.showEmbeds && embedURL}
  <div
    class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full"
  >
    <div class="ml-auto mr-auto mt-1 mb-1 max-w-4xl">
      <div
        class="iframe-container rounded-md max-w-screen max-h-[480px] mx-auto relative overflow-hidden pt-[56.5%]"
      >
        <iframe
          title="YouTube Video"
          class="h-full w-full absolute top-0"
          src={embedURL}
          allow="accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowfullscreen
        />
      </div>
    </div>
  </div>
{/if}
