<script lang="ts">
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { Button } from 'mono-svelte'
  import { ChevronDoubleDown, Icon } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'

  const MAX_HEIGHT = 192

  let element = $state<Element>()

  function isOverflown(element: Element) {
    if (!element) return false

    return element.scrollHeight > MAX_HEIGHT
  }

  interface Props {
    body: string
    clickThrough?: boolean
    element?: string
    style?: string
    class?: ClassValue
  }

  let {
    body,
    clickThrough = false,
    element: htmlElement = 'div',
    style = '',
    class: clazz = '',
  }: Props = $props()

  let overflows = $derived(element ? isOverflown(element) : false)

  let expanded = $state(false)
  $effect(() => {
    expanded = !overflows
  })
</script>

<svelte:element
  this={htmlElement}
  {style}
  class={[
    expanded
      ? 'text-slate-600 dark:text-zinc-400 max-h-full'
      : [
          'overflow-hidden bg-linear-to-b text-transparent from-slate-600 via-slate-600',
          'dark:from-zinc-400 dark:via-zinc-400 bg-clip-text z-0 max-h-36',
        ],
    clickThrough && 'pointer-events-none',
    clazz,
  ]}
  bind:this={element}
>
  <Markdown source={expanded ? body : body.slice(0, 1000)} />
  {#if overflows}
    <Button
      onclick={() => (expanded = !expanded)}
      size="square-md"
      color="ghost"
      class={[
        'text-black dark:text-white absolute z-10 isolate pointer-events-auto bottom-0',
        'left-1/2 -translate-x-1/2 mb-4 hover:backdrop-blur-lg bg-slate-100 dark:bg-zinc-900/50',
        expanded && 'shadow-md rotate-180',
      ]}
      title="Expand"
    >
      <Icon src={ChevronDoubleDown} size="20" mini />
    </Button>
  {/if}
</svelte:element>
