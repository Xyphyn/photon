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
  this={settings.value.expandImages ? 'button' : 'a'}
  href={postLink(post)}
  class={[
    'container/a z-10 rounded-2xl cursor-pointer relative overflow-hidden',
    'bg-slate-100 dark:bg-zinc-900 transition-colors',
    'border border-slate-200 dark:border-zinc-800 group',
  ]}
  data-sveltekit-preload-data="off"
  aria-label={post.name}
  onclick={() => showImage(bestImageURL(post, false, -1, null))}
  role="button"
  tabindex="0"
>
  <!-- svelte-ignore a11y_missing_attribute -->
  <div class="inset-0 absolute -z-10 rounded-xl overflow-hidden">
    <img
      loading="lazy"
      fetchpriority="auto"
      src={bestImageURL(post, false, 64)}
      class=" object-cover w-full h-full opacity-50 blur-lg"
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
        'max-w-full rounded-xl z-30 transition-all max-h-[60vh] duration-500 object-contain mx-auto group-hover:scale-98 group-active:scale-95',
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
        onclick={(e) => {
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
