<script lang="ts" module>
  import { marked } from 'marked'
  import { setContext } from 'svelte'
  import type { ClassValue } from 'svelte/elements'
  import MdTree from './MdTree.svelte'
  import MdCode from './renderers/MdCode.svelte'
  import MdHeading from './renderers/MdHeading.svelte'
  import MdHr from './renderers/MdHr.svelte'
  import MdHtml from './renderers/MdHtml.svelte'
  import MdImage from './renderers/MdImage.svelte'
  import MdLink from './renderers/MdLink.svelte'
  import MdList from './renderers/MdList.svelte'
  import MdListItem from './renderers/MdListItem.svelte'
  import MdParagraph from './renderers/MdParagraph.svelte'
  import MdQuote from './renderers/MdQuote.svelte'
  import MdSpoiler from './renderers/MdSpoiler.svelte'
  import MdSubscript from './renderers/MdSubscript.svelte'
  import MdSuperscript from './renderers/MdSuperscript.svelte'
  import MdText from './renderers/MdText.svelte'
  import { linkify, subSupscriptExtension } from './renderers/plugins'
  import containerExtension from './renderers/spoiler/spoiler'
  import MdCodespan from './renderers/subtext/MdCodespan.svelte'
  import MdDel from './renderers/subtext/MdDel.svelte'
  import MdEm from './renderers/subtext/MdEm.svelte'
  import MdStrong from './renderers/subtext/MdStrong.svelte'
  import MdTable from './renderers/table/MdTable.svelte'
  import MdTableBody from './renderers/table/MdTableBody.svelte'
  import MdTableCell from './renderers/table/MdTableCell.svelte'
  import MdTableHead from './renderers/table/MdTableHead.svelte'
  import MdTableRow from './renderers/table/MdTableRow.svelte'

  function preprocess(src: string) {
    return src
      .replaceAll(/\[([^\]]*)\]\(\s*javascript:[^)]*\)/gim, '*link removed*')
      .replaceAll(/^\s*\[[^\]]+\]:\s*javascript:.*$/gim, '*link removed*')
  }

  marked.setOptions({
    gfm: true,
    breaks: false,
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
      subSupscriptExtension((params: any) => {
        if (params.type == 'subscript') {
          return {
            type: 'subscript',
            raw: params.raw,
            text: params.content,
          }
        }
        if (params.type == 'superscript') {
          return {
            type: 'superscript',
            raw: params.raw,
            text: params.content,
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
    code: MdCode,
    list: MdList,
    spoiler: MdSpoiler,
    table: MdTable,
    tablebody: MdTableBody,
    tablecell: MdTableCell,
    tablehead: MdTableHead,
    tablerow: MdTableRow,
    paragraph: MdParagraph,
    listitem: MdListItem,
    subscript: MdSubscript,
    superscript: MdSuperscript,
    space: MdParagraph,
    list_item: MdListItem,
    text: MdText,
    escape: MdText,
    em: MdEm,
    strong: MdStrong,
    del: MdDel,
    codespan: MdCodespan,
  }

  export const inlineRenderers = {
    paragraph: MdParagraph,
    subscript: MdSubscript,
    superscript: MdSuperscript,
    text: MdText,
    link: MdLink,
    em: MdEm,
    strong: MdStrong,
    del: MdDel,
    codespan: MdCodespan,
  }

  export type Renderer = keyof typeof renderers
</script>

<script lang="ts">
  interface RendererOptions {
    autoloadImages: boolean
  }

  interface Props {
    source?: string
    inline?: boolean
    noStyle?: boolean
    style?: string
    class?: ClassValue
    rendererOptions?: RendererOptions
  }

  let {
    source = '',
    inline = false,
    noStyle = false,
    style = '',
    class: clazz = '',
    rendererOptions = {
      autoloadImages: true,
    },
  }: Props = $props()

  setContext('options', {
    ...rendererOptions,
    inline: inline,
    noStyle: noStyle,
  })

  let tokens = $derived(marked.lexer(preprocess(source)))
</script>

<svelte:element
  this={inline ? 'div' : 'article'}
  dir="auto"
  class={[!noStyle && 'break-words space-y-4 leading-normal', clazz]}
  {style}
>
  <MdTree {tokens} renderers={inline ? inlineRenderers : renderers} />
</svelte:element>
