<script lang="ts">
  import { md } from '$lib/components/markdown/markdown'
  import { page } from '$app/stores'

  export let source: string = ''

  md.linkify.add('!', {
    validate: function (text, pos, self) {
      var tail = text.slice(pos)

      if (!self.re.community) {
        self.re.community = new RegExp(
          /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})/
        )
      }
      if (self.re.community.test(tail)) {
        // Linkifier allows punctuation chars before prefix,
        // but we additionally disable `@` ("@@mention" is invalid)
        if (pos >= 2 && tail[pos - 2] === '!') {
          return false
        }
        return tail.match(self.re.community)![0].length
      }
      return 0
    },
    normalize: function (match) {
      match.url = `${$page.url.origin}/c/${match.url.slice(1)}`
    },
  })
</script>

<div class="break-words flex flex-col markdown gap-2 leading-[22px]">
  {@html md.render(source)}
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
    @apply list-disc pl-4 leading-3;
  }

  .markdown :global(ol) {
    @apply list-decimal pl-4 leading-3;
  }

  .markdown :global(ul > *) {
    @apply leading-[22px];
  }

  .markdown :global(ol > *) {
    @apply leading-[22px];
  }

  .markdown :global(li) {
    @apply m-0 leading-[22px] !important;
  }

  .markdown :global(li > *) {
    @apply m-0 leading-[22px] !important;
  }

  .markdown :global(blockquote) {
    @apply border-l-2 border-black/20 dark:border-white/20 pl-2 my-1 h-max;
  }

  .markdown :global(p) {
    @apply leading-[22px];
  }
</style>
