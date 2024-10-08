<script lang="ts">
  import {
    bestImageURL,
    optimizeImageURL,
    postLink,
    type MediaType,
  } from '$lib/components/lemmy/post/helpers.js'
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings, type View } from '$lib/settings.js'
  import { isImage } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'
  import { Material, Popover } from 'mono-svelte'
  import {
    DocumentText,
    Icon,
    Link,
    VideoCamera,
    ExclamationTriangle,
  } from 'svelte-hero-icons'

  export let post: Post
  export let type: MediaType = 'none'
  export let view: View = 'cozy'
  export let blur: boolean = post.nsfw && $userSettings.nsfwBlur

  const thumbnailSize = (view: View) =>
    view == 'compact' ? 'w-22 h-22 sm:w-28' : 'w-24 h-24 sm:w-32'

  $: size = thumbnailSize(view)
</script>

<!-- 
  @component
  Thumbnails for compact and list view posts.
-->
<div
  class="{size} relative group/media {$$props.class ?? ''}"
  style={$$props.style ?? ''}
>
  {#if post.alt_text}
    <Popover
      openOnHover
      placement={$userSettings.leftAlign ? 'bottom-start' : 'bottom-end'}
    >
      <Material
        slot="target"
        padding="none"
        rounding="full"
        elevation="high"
        class="w-max absolute bottom-0 left-0 py-0.5 px-1.5 m-1 font-bold"
      >
        ALT
      </Material>
      <div class="max-w-sm">
        {post.alt_text}
      </div>
    </Popover>
  {/if}
  <svelte:element
    this={!$userSettings.expandImages || type != 'image' ? 'a' : 'button'}
    href={postLink(post)}
    on:click={() => {
      if (type == 'image') {
        showImage(bestImageURL(post, false, -1))
      }
    }}
    role="button"
    tabindex="0"
  >
    {#if post.thumbnail_url || isImage(post.url)}
      <div class="relative overflow-hidden rounded-xl">
        <picture class="relative">
          <img
            src={optimizeImageURL(post.thumbnail_url || post.url || '', 256)}
            loading="lazy"
            class="object-cover overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-xl
        transition-colors {size}"
            alt={post.name}
            class:blur-xl={blur}
          />
          {#if type != 'image'}
            <div
              class="absolute w-8 h-8 bottom-0 left-0 m-1 rounded-xl text-slate-800 dark:text-zinc-200
              backdrop-blur-sm bg-slate-25/75 dark:bg-zinc-900/75 border border-slate-200/75 dark:border-zinc-700/75
              grid place-items-center"
            >
              <Icon
                src={type == 'iframe' ? VideoCamera : Link}
                micro
                size="16"
              />
            </div>
          {/if}
        </picture>
      </div>
      {#if blur}
        <div
          class="absolute w-full h-full grid place-items-center inset-0 z-30"
        >
          <Icon
            src={ExclamationTriangle}
            solid
            size="32"
            class="z-50 opacity-30"
          />
        </div>
      {/if}
    {:else}
      <div
        class="object-cover overflow-hidden bg-slate-50 dark:bg-zinc-900 rounded-xl
        border border-slate-200 dark:border-zinc-800 group-hover/media:border-slate-400
        group-hover/media:dark:border-zinc-600 transition-colors text-slate-400 dark:text-zinc-600 grid
        place-items-center {size}"
      >
        <Icon
          src={type == 'embed'
            ? Link
            : type == 'iframe'
              ? VideoCamera
              : DocumentText}
          solid
          size="32"
        />
      </div>
    {/if}
  </svelte:element>
</div>
