<script lang="ts">
  import {
    bestImageURL,
    optimizeImageURL,
    postLink,
    type MediaType,
  } from '$lib/components/lemmy/post/helpers.js'
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import { userSettings } from '$lib/settings.js'
  import { isImage } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'
  import { Material, Popover } from 'mono-svelte'
  import { DocumentText, Icon, Link, VideoCamera } from 'svelte-hero-icons'

  export let post: Post
  export let type: MediaType = 'none'
</script>

<!-- 
  @component
  Thumbnails for compact and list view posts.
-->
  <div
    class="w-24 sm:w-32 h-24 relative group/media {$$props.class ?? ''}"
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
          showImage(bestImageURL(post, false, 2048))
        }
      }}
      role="button"
      tabindex="0"
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
        showImage(bestImageURL(post, false, 2048))
      }
    }}
    role="button"
    tabindex="0"
  >
    {#if post.thumbnail_url || isImage(post.url)}
      <img
        src={optimizeImageURL(post.thumbnail_url || post.url || '', 128)}
        loading="lazy"
        class="object-cover overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-xl h-24 w-24 sm:w-32
        border border-slate-200 dark:border-zinc-800 group-hover/media:border-slate-400
        group-hover/media:dark:border-zinc-600 transition-colors"
        alt={post.name}
      />
      {#if type != 'image'}
        <div
          class="relative w-7 h-7 bottom-8 left-1 rounded-lg text-slate-800 dark:text-zinc-200
          backdrop-blur-sm bg-[#ffffff]/75 dark:bg-black/75 grid place-items-center"
        >
          <Icon src={type == 'iframe' ? VideoCamera : Link} mini size="16" />
        </div>
      {/if}
    {:else}
      <div
        class="object-cover overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-xl h-24 w-24 sm:w-32
        border border-slate-200 dark:border-zinc-800 group-hover/media:border-slate-400
        group-hover/media:dark:border-zinc-600 transition-colors text-slate-400 dark:text-zinc-600 grid
        place-items-center"
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
