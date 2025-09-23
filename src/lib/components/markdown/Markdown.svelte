<script lang="ts" module>
  import { marked } from 'marked'
  import {
    MdCode,
    MdHeading,
    MdHr,
    MdHtml,
    MdImage,
    MdLink,
    MdQuote,
    MdList,
    MdTable,
    MdTableBody,
    MdSpoiler,
    MdTableCell,
    MdTableHead,
    MdTableRow,
    MdParagraph,
    MdListItem,
    MdSubscript,
    MdSuperscript,
    MdText,
  } from './renderers/index'
  import { linkify, subSupscriptExtension } from './renderers/plugins.js'
  import containerExtension from './renderers/spoiler/spoiler.js'

  marked.setOptions({
    gfm: true,
    breaks: false,
  })

  marked.use(linkify, {
    extensions: [
      // @ts-expect-error hell with marked
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
      // @ts-expect-error hell with marked
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
  }

  export const inlineRenderers = {
    paragraph: MdParagraph,
    subscript: MdSubscript,
    superscript: MdSuperscript,
    text: MdText,
    link: MdLink,
  }

  export type Renderer = keyof typeof renderers
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import type { ClassValue } from 'svelte/elements'
  import MdTree from './MdTree.svelte'

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

  setContext('options', rendererOptions)

  let tokens = $derived(marked.lexer(source))
</script>

<article
  dir="auto"
  class={[!noStyle && 'break-words space-y-4 leading-normal', clazz]}
  {style}
>
  <MdTree {tokens} renderers={inline ? inlineRenderers : renderers} />
</article>
