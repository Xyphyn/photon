<script lang="ts">
  import type { Post } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { settings, type View } from '$lib/app/settings.svelte'
  import { showImage } from '$lib/ui/generic/ExpandableImage.svelte'
  import { Button, modal } from 'mono-svelte'
  import {
    Calendar,
    DocumentText,
    ExclamationTriangle,
    Icon,
    Link,
    Photo,
    PresentationChartBar,
    VideoCamera,
  } from 'svelte-hero-icons/dist'
  import { bestImageURL, postLink, type MediaType } from '../helpers'

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
    blur = post.nsfw && settings.value.nsfwBlur,
    style = '',
    class: clazz = '',
  }: Props = $props()

  let size = $derived(thumbnailSize(view))
</script>

<!-- 
  @component
  Thumbnails for compact and list view posts.
-->
<div class={[size, 'relative group/media', clazz]} {style} role="presentation">
  <svelte:element
    this={!settings.value.expandImages || type != 'image' ? 'a' : 'button'}
    href={postLink(post)}
    aria-label={type == 'image'
      ? $t('aria.postDecor.openImage', { default: post.name })
      : $t('aria.postDecor.openPost', { default: post.name })}
    onclick={() => {
      if (type == 'image') showImage(bestImageURL(post, false, -1))
    }}
    role={type == 'image' ? 'button' : 'link'}
    tabindex="0"
    class="cursor-pointer h-full block"
  >
    <div
      class={[
        'relative overflow-hidden rounded-2xl max-h-full h-full',
        'border border-slate-200 dark:border-zinc-800 hover-scale-effect bg-slate-200 dark:bg-zinc-800',
      ]}
    >
      {#if post.thumbnail_url || type == 'image'}
        {@const thumbnail = post.thumbnail_url != undefined && type != 'image'}
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
            src={blur ? '' : bestImageURL(post, thumbnail, -1, null)}
            loading="lazy"
            class={[
              'object-cover relative overflow-hidden rounded-xl h-full',
              size,
            ]}
            alt={post.alt_text ?? ' '}
            class:blur-xl={blur}
          />
        </picture>
        {#if type != 'image'}
          <div
            class={[
              'absolute w-8 h-8 bottom-1 left-1 rounded-xl bg-slate-25 dark:bg-zinc-900 grid place-items-center',
            ]}
          >
            <Icon src={type == 'iframe' ? VideoCamera : Link} micro size="16" />
          </div>
        {/if}
      {:else}
        {@const typeIconMap = new Map([
          ['embed', Link],
          ['iframe', VideoCamera],
          ['poll', PresentationChartBar],
          ['event', Calendar],
        ])}
        <div
          class={[
            'bg-slate-100 dark:bg-zinc-900 w-full h-full rounded-xl grid place-items-center',
            'text-slate-600 dark:text-zinc-400',
          ]}
        >
          <Icon src={typeIconMap.get(type) ?? DocumentText} solid size="32" />
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
  {#if post.alt_text}
    <Button
      onclick={() => modal({ title: 'Alt text', body: post.alt_text })}
      aria-label="Alt text"
      class="absolute bottom-0 left-0 z-20 m-1"
      size="square-md"
      rounding="xl"
    >
      <Icon src={Photo} size="16" micro />
    </Button>
  {/if}
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
