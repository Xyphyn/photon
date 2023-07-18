<script lang="ts">
  import MarkdownIt from 'markdown-it'
  const md = new MarkdownIt({
    html: false,
    linkify: true,
  })

  export let source: string = ''
</script>

<div class="break-words flex flex-col gap-3 leading-[22px] markdown">
  {@html md.render(source)}
</div>

<style lang="postcss">
  .markdown :global(h1) {
    @apply text-3xl font-bold my-2;
  }
  .markdown :global(h2) {
    @apply text-2xl font-bold my-2;
  }
  .markdown :global(h3) {
    @apply text-xl font-bold my-2;
  }

  .markdown :global(hr) {
    @apply w-[90%] mx-auto my-4 opacity-50;
  }

  .markdown :global(img) {
    @apply max-h-[40vh] border rounded-md border-slate-200 dark:border-zinc-800;
  }

  .markdown :global(a) {
    @apply text-sky-500 hover:underline;
  }

  .markdown :global(ul) {
    @apply list-disc pl-4;
    line-height: 1rem;
  }

  .markdown :global(ol) {
    @apply list-decimal pl-4;
    line-height: 1rem;
  }

  .markdown :global(li) {
    @apply m-0 !important;
  }

  .markdown :global(li > *) {
    @apply m-0 !important;
    line-height: 22px;
  }

  .markdown :global(blockquote) {
    @apply border-l-2 border-black/20 dark:border-white/20 pl-2 my-1 h-max;
    line-height: 0.5rem;
  }

  .markdown :global(blockquote > *) {
    line-height: 22px;
  }
</style>
