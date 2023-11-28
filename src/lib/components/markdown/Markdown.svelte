<script lang="ts">
  import { PUBLIC_SSR_ENABLED } from '$env/static/public'
  import { md, mdInline, photonify } from '$lib/components/markdown/markdown'
  import { onMount } from 'svelte'

  export let source: string = ''
  export let inline: boolean = false

  let rendered = ''

  function replaceURLs(node: HTMLElement, source: string) {
    if (!div) return
    const links = node.querySelectorAll('a')

    links.forEach((l) => {
      const photonified = photonify(l.href)
      if (photonified) l.href = photonified
    })
  }

  let div: HTMLElement

  function render(source: string): string {
    if (!source || source == '') return ''

    try {
      return inline ? mdInline.render(source) : md.render(source)
    } catch (err) {
      console.error(err)
      return ''
    }
  }
  $: rendered = render(source)
  $: replaceURLs(div, rendered)
  /*
    Horrendous hack to get @html reactivity working
    From server to client, the rendered html won't change for some reason
    I have no clue why this fixes it, but it does.
  */
  if (PUBLIC_SSR_ENABLED.toLowerCase() == 'true') {
    onMount(() => {
      rendered = `${rendered} `
      replaceURLs(div, rendered)
    })
  }
</script>

<div
  bind:this={div}
  class="break-words flex flex-col markdown gap-2 leading-[1.5]"
>
  {@html rendered}
</div>

<style lang="postcss">
  .markdown :global(h1) {
    @apply text-3xl font-bold;
  }
  .markdown :global(h2) {
    @apply text-2xl font-bold;
  }
  .markdown :global(h3) {
    @apply text-xl font-bold;
  }

  .markdown :global(details) {
    @apply cursor-pointer;
  }

  .markdown :global(hr) {
    @apply w-full mx-auto my-2 border-slate-300 dark:border-zinc-800;
  }

  :global(.dark .markdown hr) {
    @apply w-full mx-auto my-2 border-zinc-800;
  }

  .markdown :global(img) {
    @apply max-h-[40vh] border rounded-md border-slate-200 dark:border-zinc-800;
  }

  :global(.dark .markdown img) {
    @apply border-zinc-800;
  }

  .markdown :global(a) {
    @apply text-sky-500 hover:underline;
  }

  .markdown :global(ul) {
    @apply list-disc pl-4 leading-3;
  }

  .markdown :global(ol) {
    @apply list-decimal pl-4 leading-3;
  }

  .markdown :global(ul > *) {
    @apply leading-[20px];
  }

  .markdown :global(ol > *) {
    @apply leading-[20px];
  }

  .markdown :global(li) {
    @apply m-0 leading-[1.5] !important;
  }

  .markdown :global(li > *) {
    @apply m-0 leading-[1.5] !important;
  }

  .markdown :global(blockquote) {
    @apply leading-[1px] border-l-2 border-slate-400 dark:border-zinc-600 pl-2 my-1 h-max;
  }

  .markdown :global(p) {
    @apply leading-[1.5] max-w-3xl;
    word-break: break-word;
  }
</style>
