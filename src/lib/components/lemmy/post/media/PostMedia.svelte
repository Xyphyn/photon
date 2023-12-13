<script lang="ts">
  import Empty from '$lib/components/helper/Empty.svelte'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import {
    bestImageURL,
    postLink,
    type MediaType,
    iframeType,
  } from '$lib/components/lemmy/post/helpers.js'
  import ExpandableImage from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings } from '$lib/settings.js'
  import { isImage, isVideo } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'
  import { Icon, VideoCamera } from 'svelte-hero-icons'
  import PostIframe from './PostIframe.svelte'

  export let view: 'card' | 'cozy' | 'list' | 'compact' = 'cozy'
  export let post: Post
  export let type: MediaType = 'none'
  export let opened: boolean | undefined = undefined
</script>

{#if type == 'image'}
  {#if view == 'card' || view == 'cozy'}
    <!--disabled preloads here since most people will hover over every image while scrolling-->
    <svelte:component
      this={$userSettings.expandImages ? ExpandableImage : Empty}
      url={bestImageURL(post, false, 2048)}
      class="container mx-auto w-fit"
    >
      <svelte:element
        this={$userSettings.expandImages ? 'div' : 'a'}
        href={postLink(post)}
        class="container mx-auto z-10 transition-colors rounded-xl max-h-[60vh] relative overflow-hidden"
        data-sveltekit-preload-data="off"
        aria-label={post.name}
      >
        <picture
          class="absolute top-1/2 -translate-y-1/2 left-0 w-full
               opacity-30 object-cover scale-[1.2] blur-3xl -z-10"
        >
          <source
            srcset={bestImageURL(post, false, 512)}
            media="(max-width: 256px)"
          />
          <source
            srcset={bestImageURL(post, false, 512)}
            media="(max-width: 512px)"
          />
          <!-- svelte-ignore a11y-missing-attribute -->
          <img
            src={bestImageURL(post, false, 1024)}
            loading="lazy"
            class="w-full h-full object-cover rounded-xl blur-3xl z-50"
            width={512}
            height={300}
          />
        </picture>
        <picture class="max-h-[inherit]">
          <source
            srcset={bestImageURL(post, false, 512)}
            media="(max-width: 256px)"
          />
          <source
            srcset={bestImageURL(post, false, 512)}
            media="(max-width: 512px)"
          />
          <!-- svelte-ignore a11y-missing-attribute -->
          <img
            src={bestImageURL(post, false, 1024)}
            loading="lazy"
            class="max-h-[inherit] max-w-full h-auto z-30
                  transition-opacity duration-300 object-contain mx-auto"
            width={512}
            height={300}
            class:blur-3xl={post.nsfw && $userSettings.nsfwBlur}
          />
        </picture>
      </svelte:element>
    </svelte:component>
  {/if}
{:else if type == 'video' && (view == 'cozy' || view == 'card')}
  <a
    href={postLink(post)}
    style="height: 300px;"
    class="w-full rounded-xl flex flex-col items-center justify-center relative z-0 overflow-hidden
          text-white p-4"
  >
    <div
      class="absolute blur-xl -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-green-800 via-blue-900 via-20% to-red-700"
    />
    <Icon src={VideoCamera} solid size="48" />
    <span class="font-bold text-2xl">Video</span>
    <p class="text-base">Go to the post to view this video.</p>
  </a>
{:else if type == 'iframe' && (view == 'cozy' || view == 'card') && post.url}
  <PostIframe
    thumbnail={post.thumbnail_url}
    type={iframeType(post)}
    url={post.url}
    {opened}
  />
{:else if type == 'embed' && post.url}
  <PostLink
    url={post.url}
    thumbnail_url={post.thumbnail_url}
    nsfw={post.nsfw}
    embed_description={post.embed_description}
    embed_title={post.embed_title}
    compact={view == 'compact'}
  />
{/if}
