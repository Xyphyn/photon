<script lang="ts">
  import type { Post } from '$lib/api/types'
  import { settings } from '$lib/app/settings.svelte'
  import { showImage } from '$lib/ui/generic/ExpandableImage.svelte'
  import { Button, modal } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { bestImageURL, postLink } from '../helpers'

  interface Props {
    post: Post
    blur?: boolean
  }

  let { post, blur = false }: Props = $props()

  let imageLoaded: boolean | null = $state(null)
  onMount(() => {
    imageLoaded = false
  })
</script>

<!--disabled preloads here since most people will hover over every image while scrolling-->
<svelte:element
  this={settings.expandImages ? 'button' : 'a'}
  href={postLink(post)}
  class={['container/a group post-image-container']}
  data-sveltekit-preload-data="off"
  aria-label={post.name}
  onclick={() => showImage(bestImageURL(post, false, -1, null))}
  role="button"
  tabindex="0"
>
  <!-- svelte-ignore a11y_missing_attribute -->
  <div class="post-image-blur-container">
    <img
      loading="lazy"
      fetchpriority="auto"
      src={bestImageURL(post, false, 64)}
      class="post-image-blur"
    />
  </div>
  <picture class="max-h-[60vh]">
    {#each ['webp'] as format}
      <source
        srcset="{bestImageURL(
          post,
          false,
          512,
          format as 'avif' | 'webp',
        )} 512w, {bestImageURL(
          post,
          false,
          768,
          format as 'avif' | 'webp',
        )} 768w, {bestImageURL(
          post,
          false,
          1024,
          format as 'avif' | 'webp',
        )} 1024w"
        media="(min-width: 0px)"
        type="image/{format}"
      />
    {/each}
    <img
      src={blur ? '' : bestImageURL(post, false, -1, null)}
      loading="lazy"
      class={[
        'post-image',
        'duration-200 ease-cubic',
        imageLoaded === false ? 'opacity-0' : 'opacity-100',
        blur && 'blur-3xl',
      ]}
      width={512}
      height={300}
      alt={post.alt_text ?? ''}
      onload={() => (imageLoaded = true)}
    />
  </picture>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="absolute bottom-0 left-0 right-0 flex justify-between items-center
        rounded-full ml-auto w-max m-2 p-0 gap-1
        *:bg-white *:border *:border-slate-200 dark:*:border-zinc-800 dark:*:bg-zinc-900"
    onclick={(e) => e.stopPropagation()}
  >
    {#if post.alt_text}
      <Button
        onclick={(e: MouseEvent) => {
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

<style>
  @reference '../../../../app.css';

  .post-image-container {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-2xl);
    cursor: pointer;
    background-color: var(--color-slate-100);
    border: 1px solid var(--color-slate-200);
    z-index: 10;

    @variant dark {
      background-color: var(--color-zinc-900);
      border-color: var(--color-zinc-800);
    }

    .post-image {
      max-width: 100%;
      z-index: 30;
      margin-left: auto;
      margin-right: auto;
      transition: filter 400ms cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    &:hover {
      .post-image {
        transition-duration: 0;
        filter: brightness(85%);
      }
    }

    &:active {
      .post-image {
        filter: brightness(75%);
      }
    }
  }

  .post-image-blur-container {
    position: absolute;
    inset: 0;
    z-index: -10;
    overflow: hidden;

    .post-image-blur {
      width: 2%;
      height: 2%;
      filter: blur(1px);
      opacity: 0.3;
      transform: scale(100);
      transform-origin: center;
    }
  }
</style>
