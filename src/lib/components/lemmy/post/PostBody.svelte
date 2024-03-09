<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import type { View } from '$lib/settings'
  import { Button } from 'mono-svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'

  export let body: string
  export let view: View = 'cozy'
  let overflows = false
  let expanded = false

  function isOverflown(element: Element) {
    overflows =
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth

    if (!overflows) expanded = true
  }
</script>

<div
  style={$$props.style ?? ''}
  class="{!expanded
    ? `text-sm overflow-hidden
bg-gradient-to-b text-transparent from-slate-600 via-slate-600
dark:from-zinc-400 dark:via-zinc-400 bg-clip-text z-0
${view == 'list' ? `max-h-24` : 'max-h-48'}`
    : 'text-slate-600 dark:text-zinc-400 max-h-full'} {$$props.class ?? ''}"
  use:isOverflown
>
  <Markdown inline={!expanded} source={body} />
  {#if overflows}
    <Button
      on:click={() => (expanded = !expanded)}
      size="square-sm"
      color="tertiary"
      class="text-black dark:text-white absolute z-10 isolate drop-shadow-xl {expanded
        ? 'bottom-6'
        : 'bottom-16'} left-1/2 -translate-x-1/2"
      title="Expand"
    >
      <Icon
        src={ChevronDown}
        size="20"
        mini
        class="{expanded ? 'rotate-180' : ''} transition-transform"
      />
    </Button>
  {/if}
</div>
