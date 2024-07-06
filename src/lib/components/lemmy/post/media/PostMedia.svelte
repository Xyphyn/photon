<script lang="ts">
  import Empty from '$lib/components/helper/Empty.svelte'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import {
    bestImageURL,
    postLink,
    type MediaType,
    iframeType,
  } from '$lib/components/lemmy/post/helpers.js'
  import ExpandableImage, {
    showImage,
  } from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings } from '$lib/settings.js'
  import type { Post } from 'lemmy-js-client'
  import PostIframe from './PostIframe.svelte'
  import { Button, Material } from 'mono-svelte'

  export let view: 'card' | 'cozy' | 'list' | 'compact' = 'cozy'
  export let post: Post
  export let type: MediaType = 'none'
  export let opened: boolean | undefined = undefined

  let showAltText = false
</script>

{#if type == 'image'}
  {#if view == 'card' || view == 'cozy'}
    <!--disabled preloads here since most people will hover over every image while scrolling-->
    <svelte:element
      this={$userSettings.expandImages ? 'button' : 'a'}
      href={postLink(post)}
      class="container mx-auto z-10 rounded-xl max-h-[60vh] relative overflow-hidden bg-slate-100 dark:bg-zinc-900
      "
      data-sveltekit-preload-data="off"
      aria-label={post.name}
      on:click={() => showImage(bestImageURL(post, false, 2048))}
      role="button"
      tabindex="0"
    >
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src={bestImageURL(post, false, 256)}
        loading="lazy"
        class="-z-10 absolute top-0 left-0 w-full h-full object-cover blur-xl opacity-50"
      />
      <picture class="max-h-[inherit]">
        <source
          srcset={bestImageURL(post, false, 256)}
          media="(max-width: 256px)"
        />
        <source
          srcset={bestImageURL(post, false, 512)}
          media="(max-width: 512px)"
        />
        <source
          srcset={bestImageURL(post, false, 1024)}
          media="(max-width: 1024px)"
        />
        <source
          srcset={bestImageURL(post, false, 1512)}
          media="(max-width: 1512px)"
        />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src={bestImageURL(post, false, 2048)}
          loading="lazy"
          class="max-h-[inherit] max-w-full h-auto z-30
                  transition-opacity duration-300 object-contain mx-auto"
          width={512}
          height={300}
          class:blur-3xl={post.nsfw && $userSettings.nsfwBlur}
          alt={post.alt_text ?? ''}
        />
      </picture>
      {#if post.alt_text}
        <Button
          on:click={(e) => {
            e.stopPropagation()
            showAltText = !showAltText
          }}
          class="absolute bottom-0 left-0 text-sm m-2 text-left"
          size="sm"
          rounding="lg"
          alignment="left"
        >
          {#if showAltText}
            {post.alt_text}
          {:else}
            <span class="font-bold">ALT</span>
          {/if}
        </Button>
      {/if}
    </svelte:element>
  {/if}
{:else if (type == 'iframe' || type == 'video') && (view == 'cozy' || view == 'card') && post.url}
  <PostIframe
    thumbnail={post.thumbnail_url}
    type={iframeType(post)}
    url={post.url}
    {opened}
  />
{:else if type == 'embed' && post.url}
  <PostLink
    url={post.url}
    thumbnail_url={view != 'list' ? post.thumbnail_url : undefined}
    nsfw={post.nsfw}
    embed_description={post.embed_description}
    embed_title={post.embed_title}
    compact={view == 'compact' || (view == 'list' && !post.embed_title)}
  />
{/if}
