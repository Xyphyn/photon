<script lang="ts">
  import {
    iframeType,
    mediaType,
    optimizeImageURL,
  } from '$lib/components/lemmy/post/helpers'
  import PostIframe from '$lib/components/lemmy/post/media/PostIframe.svelte'
  import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
  import { t } from '$lib/i18n/translations'
  import { getContext } from 'svelte'
  import { ArrowDownTray, Icon } from 'svelte-hero-icons'

  let loaded: boolean = $state(
    (getContext('options') as { autoloadImages: boolean })?.autoloadImages ??
      true,
  )

  interface Props {
    href: string
    title?: string | undefined
    text?: string
  }

  let { href, title = undefined, text = '' }: Props = $props()

  let type = $derived(mediaType(href, 'cozy'))
</script>

<div
  class="w-auto h-auto max-h-96 rounded-2xl p-2 border border-slate-200 dark:border-zinc-800
  inline-block"
>
  {#if loaded}
    {#if type == 'video' || type == 'embed' || type == 'iframe'}
      <PostIframe
        type={iframeType(href)}
        url={href}
        opened={true}
        autoplay={false}
        class="w-auto h-auto max-h-80 inline-block rounded-lg"
      />
    {:else}
      <button
        class="inline"
        onclick={() => showImage(optimizeImageURL(href, -1))}
      >
        <img
          src={optimizeImageURL(href, 1024)}
          {title}
          alt={text}
          width={300}
          height={300}
          class="object-contain w-auto h-auto max-h-80 inline rounded-lg"
        />
      </button>
    {/if}
  {:else}
    <button
      onclick={() => (loaded = true)}
      class="w-40 h-40 flex flex-col justify-center items-center gap-4 p-2 group"
      title={$t('common.download')}
    >
      <Icon
        src={ArrowDownTray}
        size="24"
        class="text-primary-900 dark:text-primary-100"
      />
    </button>
  {/if}
</div>
