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

  export const options = {
    mangle: false,
    headerIds: false,
    pedantic: false,
    inline: false,
  }

  marked.setOptions(options)

  marked.use(linkify, {
    extensions: [
      // @ts-expect-error hell with marked
      // eslint-disable-next-line
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
      // eslint-disable-next-line
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
  }

  export const inlineRenderers = {
    heading: MdText,
    image: MdText,
    link: MdText,
    blockquote: MdText,
    hr: MdText,
    html: MdText,
    code: MdText,
    list: MdText,
    spoiler: MdText,
    table: MdText,
    tablebody: MdText,
    tablecell: MdText,
    tablehead: MdText,
    tablerow: MdTableRow,
    paragraph: MdParagraph,
    listitem: MdText,
    subscript: MdSubscript,
    superscript: MdSuperscript,
  }
</script>

<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import { setContext } from 'svelte'

  interface RendererOptions {
    autoloadImages: boolean
  }

  interface Props {
    source?: string
    inline?: boolean
    noStyle?: boolean
    style?: string
    class?: string
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

  options.inline = inline

  let tokens = $derived.by(() => marked.lexer(source))
</script>

<div
  class="{noStyle
    ? ''
    : 'break-words flex flex-col gap-2 leading-normal'} {clazz}"
  {style}
>
  <SvelteMarkdown
    source={tokens}
    renderers={inline ? inlineRenderers : renderers}
    {options}
    isInline={inline || undefined}
  />
</div>
