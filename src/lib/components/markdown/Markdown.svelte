<script lang="ts" context="module">
  import { marked } from 'marked'
  import {
    MdCode,
    MdHeading,
    MdHr,
    MdHtml,
    MdImage,
    MdLink,
    MdQuote,
    MdText,
    MdList,
    MdTable,
    MdTableBody,
    MdSpoiler,
    MdTableCell,
    MdTableHead,
    MdTableRow,
  } from './renderers/index'
  import { linkify } from './renderers/plugins'
  import containerExtension from './renderers/spoiler/spoiler'

  marked.setOptions({
    pedantic: false,
    // @ts-ignore
    mangle: false,
    // @ts-ignore
    headerIds: false,
  })

  marked.use(linkify, {
    extensions: [
      containerExtension((params: any) => {
        if (params.type == 'spoiler') {
          return {
            type: 'spoiler',
            raw: params.raw,
            title: params.options,
            tokens: [],
          }
        }
        return null
      }),
    ],
  })

  export const renderers = {
    heading: MdHeading,
    image: MdImage,
    link: MdLink,
    blockquote: MdQuote,
    hr: MdHr,
    html: MdHtml,
    text: MdText,
    code: MdCode,
    list: MdList,
    del: MdText,
    // @ts-ignore
    spoiler: MdSpoiler,
    table: MdTable,
    tablebody: MdTableBody,
    tablecell: MdTableCell,
    tablehead: MdTableHead,
    tablerow: MdTableRow,
  }

  export const options: any = {
    mangle: false,
    headerIds: false,
  }
</script>

<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'

  export let source: string = ''
  export let inline: boolean = false
  export let noStyle: boolean = false

  $: tokens = marked.lexer(source)
</script>

<div
  class="{noStyle
    ? ''
    : 'break-words flex flex-col gap-2 leading-[1.5]'} {$$props.class}"
  style={$$props.style}
>
  <SvelteMarkdown
    bind:source={tokens}
    {renderers}
    {options}
    isInline={inline || undefined}
  />
</div>
