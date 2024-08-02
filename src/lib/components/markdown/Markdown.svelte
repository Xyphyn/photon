<script lang="ts" context="module">
  import { marked } from 'marked'
  marked.setOptions({
    pedantic: false,
    mangle: false,
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

  export const options = {
    mangle: false,
    headerIds: false,
  }
</script>

<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import { linkify } from './renderers/plugins'
  import {
    MdCode,
    MdHeading,
    MdHr,
    MdHtml,
    MdImage,
    MdLink,
    MdQuote,
    MdText,
  } from './renderers'
  import MdList from './renderers/MdList.svelte'
  import containerExtension from './renderers/spoiler/spoiler'
  import MdSpoiler from './renderers/MdSpoiler.svelte'
  import MdTable from './renderers/table/MdTable.svelte'
  import MdTableBody from './renderers/table/MdTableBody.svelte'
  import MdTableCell from './renderers/table/MdTableCell.svelte'
  import MdTableHead from './renderers/table/MdTableHead.svelte'
  import MdTableRow from './renderers/table/MdTableRow.svelte'
  import MdParagraph from './renderers/MdParagraph.svelte'

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
