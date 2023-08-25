<script lang="ts">
  import { md, mdInline } from '$lib/components/markdown/markdown'

  export let source: string = ''
  export let inline: boolean = false

  function replaceURLs(node: HTMLElement) {
    const postRegex = /^https:\/\/([a-zA-Z0-9.-]+)\/post\/(\d+)$/

    const links = node.querySelectorAll('a')

    links.forEach((l) => {
      if (!postRegex.test(l.href)) return

      const match = l.href.match(postRegex)
      if (!match) return

      l.href = `/post/${match?.[1]}/${match?.[2]}`
    })
  }

  let div: HTMLElement

  $: if (source && div) {
    replaceURLs(div)
  }
</script>

<div
  bind:this={div}
  class="break-words flex flex-col markdown gap-2 leading-[1.5]"
>
  {#if inline}
    {@html mdInline.render(source)}
  {:else}
    {@html md.render(source)}
  {/if}
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

  .markdown :global(img) {
    @apply max-h-[40vh] border rounded-md border-slate-200 dark:border-zinc-800;
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
    @apply leading-[1.5];
  }
</style>
