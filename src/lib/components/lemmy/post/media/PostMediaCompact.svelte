<script lang="ts">
  import {
    bestImageURL,
    postLink,
    type MediaType,
  } from '$lib/components/lemmy/post/helpers.js'
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import { settings, type View } from '$lib/settings.svelte.js'
  import { isImage } from '$lib/ui/image'
  import type { Post } from 'lemmy-js-client'
  import { modal } from 'mono-svelte'
  import Button from 'mono-svelte/button/Button.svelte'
  import {
    DocumentText,
    ExclamationTriangle,
    Icon,
    Link,
    VideoCamera,
  } from 'svelte-hero-icons'

  const thumbnailSize = (view: View) =>
    view == 'compact' ? 'w-22 h-22 sm:w-28' : 'w-24 h-24 sm:w-32'

  interface Props {
    post: Post
    type?: MediaType
    view?: View
    blur?: boolean
    style?: string
    class?: string
  }

  let {
    post,
    type = 'none',
    view = 'cozy',
    blur = post.nsfw && settings.nsfwBlur,
    style = '',
    class: clazz = '',
  }: Props = $props()

  let size = $derived(thumbnailSize(view))
</script>

<!-- 
  @component
  Thumbnails for compact and list view posts.
-->
<div class={[size, 'relative group/media', clazz]} {style}>
  {#if post.alt_text}
    <Button
      rounding="pill"
      class="w-max absolute bottom-0 left-0 py-0.5 px-1.5 m-1 font-bold"
      onclick={() => modal({ title: 'Alt', body: post.alt_text ?? '' })}
    >
      ALT
    </Button>
  {/if}
  <svelte:element
    this={!settings.expandImages || type != 'image' ? 'a' : 'button'}
    href={postLink(post)}
    onclick={() => {
      if (type == 'image') showImage(bestImageURL(post, false, -1))
    }}
    role="button"
    tabindex="0"
    class="cursor-pointer h-full"
  >
    <div
      class={[
        'relative overflow-hidden rounded-2xl max-h-full h-full',
        'border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700',
        'dark:bg-zinc-800 hover-scale-effect',
      ]}
    >
      {#if post.thumbnail_url || isImage(post.url)}
        {@const thumbnail =
          post.thumbnail_url != undefined && !isImage(post.url)}
        <picture>
          <!--I would add AVIF, but lemmy.world's AVIF is broken as of currently-->
          {#each ['webp'] as format}
            <source
              srcset="{bestImageURL(
                post,
                thumbnail,
                128,
                format as 'avif' | 'webp',
              )} 1x, {bestImageURL(
                post,
                thumbnail,
                256,
                format as 'avif' | 'webp',
              )} 2x, {bestImageURL(
                post,
                thumbnail,
                512,
                format as 'avif' | 'webp',
              )} 3x"
              media="(min-width: 0px)"
              type="image/{format}"
            />
          {/each}
          <img
            src={bestImageURL(post, thumbnail, -1, null)}
            loading="lazy"
            class={[
              'object-cover relative overflow-hidden rounded-xl h-full bg-slate-200 dark:bg-zinc-900',
              size,
            ]}
            alt={post.alt_text ?? ' '}
            class:blur-xl={blur}
          />
          {#if type != 'image'}
            <div
              class={[
                'absolute w-8 h-8 m-1 bottom-0 left-0 rounded-xl text-slate-800 dark:text-zinc-200',
                'bg-slate-25 dark:bg-zinc-900',
                'grid place-items-center',
              ]}
            >
              <Icon
                src={type == 'iframe' ? VideoCamera : Link}
                micro
                size="16"
              />
            </div>
          {/if}
        </picture>
      {:else}
        <div
          class={[
            'bg-slate-100 dark:bg-zinc-900 w-full h-full rounded-xl grid place-items-center',
            'text-slate-600 dark:text-zinc-400',
          ]}
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
    </div>
    {#if blur}
      <Icon
        src={ExclamationTriangle}
        solid
        size="32"
        class="absolute w-8 h-8 mx-auto my-auto z-30 inset-0 opacity-30"
      />
    {/if}
  </svelte:element>
</div>

<style>
  .hover-scale-effect > *,
  .hover-scale-effect > picture > img {
    transition: transform 200ms var(--ease-cubic);
  }
  .hover-scale-effect:hover > *,
  .hover-scale-effect:hover > picture > img {
    transform: scale(95%);
  }
  .hover-scale-effect:active > *,
  .hover-scale-effect:active > picture > img {
    transform: scale(90%);
  }
</style>
