<script lang="ts">
  import Empty from '$lib/components/helper/Empty.svelte'
  import PostLink from '$lib/components/lemmy/post/link/PostLink.svelte'
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
  import { Button, Material, modal } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ArrowDownTray, Icon } from 'svelte-hero-icons'

  export let view: 'card' | 'cozy' | 'list' | 'compact' = 'cozy'
  export let post: Post
  export let type: MediaType = 'none'
  export let opened: boolean | undefined = undefined
  export let blur: boolean = post.nsfw && $userSettings.nsfwBlur

  let showAltText = false

  let imageLoaded: boolean | null = null

  onMount(() => {
    imageLoaded = false
  })
</script>

<!-- 
  @component
  This component will show either
  - A media item (pictures, videos) (large form factor posts only)
  - Embed link/card.
-->
{#if type == 'image'}
  {#if view == 'card' || view == 'cozy'}
    <!--disabled preloads here since most people will hover over every image while scrolling-->
    <svelte:element
      this={$userSettings.expandImages ? 'button' : 'a'}
      href={postLink(post)}
      class="container mx-auto z-10 rounded-xl max-h-[60vh] relative overflow-hidden bg-slate-100 dark:bg-zinc-900"
      data-sveltekit-preload-data="off"
      aria-label={post.name}
      on:click={() => showImage(bestImageURL(post, false, 2048))}
      role="button"
      tabindex="0"
    >
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src={bestImageURL(post, false, 64)}
        loading="lazy"
        class="-z-10 absolute top-0 left-0 w-full h-full object-cover blur-xl transition-opacity
        {imageLoaded === false ? 'opacity-40' : 'opacity-40'}"
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
                  transition-opacity duration-500 object-contain mx-auto
          {imageLoaded === false ? 'opacity-0' : 'opacity-100'}"
          width={512}
          height={300}
          class:blur-3xl={blur}
          alt={post.alt_text ?? ''}
          on:load={() => (imageLoaded = true)}
        />
      </picture>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="absolute bottom-0 left-0 right-0 flex justify-between items-center
        rounded-full ml-auto w-max m-2 p-0 gap-1
        *:bg-white *:border *:border-slate-200 *:dark:border-zinc-800 *:dark:bg-zinc-900
        *:bg-opacity-70 *:backdrop-blur-md"
        on:click|stopPropagation={() => {}}
      >
        <!-- <Button
          color="tertiary"
          size="sm"
          class="aspect-square"
          rounding="pill"
          href={post.url}
          download
        >
          <Icon src={ArrowDownTray} size="16" micro />
        </Button> -->
        {#if post.alt_text}
          <Button
            on:click={(e) => {
              e.stopPropagation()
              modal({
                title: 'Alt',
                body: post.alt_text ?? '',
              })
            }}
            color="tertiary"
            size="md"
            rounding="pill"
          >
            ALT
          </Button>
        {/if}
      </div>
    </svelte:element>
  {/if}
{:else if (type == 'iframe' || type == 'video') && (view == 'cozy' || view == 'card') && post.url}
  <PostIframe
    thumbnail={post.thumbnail_url}
    type={iframeType(post.url)}
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
    {view}
  />
{/if}
