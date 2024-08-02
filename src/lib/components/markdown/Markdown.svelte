<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import { marked } from 'marked'
  import { linkify, spoilerPlugin } from './renderers/plugins'
  import Heading from './renderers/Heading.svelte'
  import MdImage from './renderers/MdImage.svelte'

  export let source: string = ''
  export let inline: boolean = false
  export let noStyle: boolean = false

  let div: HTMLElement

  marked.use(linkify)

  $: output = marked.parse(source)
</script>

<div
  bind:this={div}
  class="{noStyle
    ? ''
    : 'break-words flex flex-col markdown gap-2 leading-[1.5]'} {$$props.class}"
  style={$$props.style}
>
  <!-- {@html rendered} -->
  <SvelteMarkdown
    source={output}
    renderers={{ heading: Heading, image: MdImage }}
  />
</div>
