<script lang="ts">
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import {
    iframeType,
    mediaType,
    optimizeImageURL,
  } from '$lib/components/lemmy/post/helpers'
  import PostIframe from '$lib/components/lemmy/post/media/PostIframe.svelte'

  export let href: string
  export let title: string | undefined = undefined
  export let text: string = ''

  $: type = mediaType(href, 'cozy')
</script>

<div
  class="w-auto h-auto max-h-96 rounded-2xl p-2 border border-slate-200 dark:border-zinc-800
  inline-block"
>
  {#if type == 'video' || type == 'embed' || type == 'iframe'}
    <PostIframe
      type={iframeType(href)}
      url={href}
      opened={true}
      autoplay={false}
      class="w-full"
    />
  {:else}
    <button
      class="inline"
      on:click={() => showImage(optimizeImageURL(href, -1), text)}
    >
      <img
        src={optimizeImageURL(href, 1024)}
        {title}
        alt={text}
        class="object-contain w-auto h-auto max-h-80 inline rounded-lg"
      />
    </button>
  {/if}
</div>
