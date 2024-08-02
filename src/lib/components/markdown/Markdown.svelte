<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import { marked } from 'marked'
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

  let div: HTMLElement

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

  $: tokens = marked.lexer(source)
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
    bind:source={tokens}
    renderers={{
      heading: MdHeading,
      image: MdImage,
      link: MdLink,
      blockquote: MdQuote,
      hr: MdHr,
      code: MdCode,
      html: MdHtml,
      text: MdText,
      list: MdList,
      del: MdText,
      // @ts-ignore
      spoiler: MdSpoiler,
      table: MdTable,
      tablebody: MdTableBody,
      tablecell: MdTableCell,
      tablehead: MdTableHead,
      tablerow: MdTableRow,
      paragraph: MdParagraph,
    }}
    options={{
      pedantic: true,
    }}
  />
</div>
