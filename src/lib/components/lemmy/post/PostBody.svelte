<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import type { View } from '$lib/settings'
  import { Button } from 'mono-svelte'
  import { ChevronDown, Icon } from 'svelte-hero-icons'

  let expanded = $state(false)
  let element: Element = $state()

  function isOverflown(element: Element, body: string = '') {
    if (!element) return
    let overflows =
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth

    if (!overflows) expanded = true
    else expanded = false

    return overflows
  }

  interface Props {
    body: string
    view?: View
    clickThrough?: boolean
    element?: string
    style?: string
    class?: string
  }

  let {
    body,
    view = 'cozy',
    clickThrough = false,
    element: htmlElement = 'div',
    style = '',
    class: clazz = '',
  }: Props = $props()

  let overflows = $derived(isOverflown(element, body))
</script>

<svelte:element
  this={htmlElement}
  {style}
  class="{!expanded
    ? ` overflow-hidden
bg-gradient-to-b text-transparent from-slate-600 via-slate-600
dark:from-zinc-400 dark:via-zinc-400 bg-clip-text z-0
${view == 'list' ? `max-h-24` : 'max-h-48'}`
    : 'text-slate-600 dark:text-zinc-400 max-h-full'} text-base {clazz}"
  class:pointer-events-none={!clickThrough}
  bind:this={element}
>
  <Markdown inline={!expanded} source={expanded ? body : body.slice(0, 1000)} />
  {#if overflows}
    <Button
      on:click={() => (expanded = !expanded)}
      size="square-sm"
      color="tertiary"
      class="text-black dark:text-white absolute z-10 isolate pointer-events-auto bottom-0 {expanded
        ? 'bg-slate-200/50 dark:bg-zinc-900 border shadow-md'
        : ''} left-1/2 -translate-x-1/2 mb-4"
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
</svelte:element>
