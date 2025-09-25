<script lang="ts">
  import {
    iframeType,
    mediaType,
    optimizeImageURL,
    PostIframe,
  } from '$comp/lemmy/post'
  import { showImage } from '$lib/ui/generic/ExpandableImage.svelte'
  import { t } from '$lib/app/i18n'
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

  let type = $derived(mediaType(href))
</script>

<div
  class="w-auto h-auto max-h-96 rounded-xl border border-slate-200 dark:border-zinc-800 inline-block group"
>
  {#if loaded}
    {#if type == 'video' || type == 'embed' || type == 'iframe'}
      <PostIframe
        type={iframeType(href)}
        url={href}
        opened={true}
        autoplay={false}
        class="w-auto h-auto max-h-80 inline-block rounded-[inherit] cursor-pointer"
      />
    {:else}
      <button
        class="inline cursor-pointer bg-slate-200 dark:bg-zinc-800 rounded-[inherit]"
        onclick={() => showImage(optimizeImageURL(href, -1))}
      >
        <img
          src={optimizeImageURL(href, 1024)}
          {title}
          alt={text}
          width={300}
          height={300}
          class={[
            'object-contain w-auto h-auto max-h-80 inline rounded-[inherit] group-hover:scale-98 group-active:scale-95',
            'transition-transform ease-cubic',
          ]}
        />
      </button>
    {/if}
  {:else}
    <button
      onclick={() => (loaded = true)}
      class="w-40 h-40 flex flex-col justify-center items-center gap-4 p-2 group cursor-pointer"
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
