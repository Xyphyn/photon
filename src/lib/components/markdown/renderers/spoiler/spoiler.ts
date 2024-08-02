import { Lexer } from 'marked'

export type ContainerOptions = Record<string, boolean | string>

export type TokenExtractionParameters = {
  /**
   * The type of container
   */
  type: string
  /**
   * The content inside the container
   */
  content: string
  /**
   * The raw full container block
   */
  raw: string
  /**
   * The options of the container
   */
  options: ContainerOptions
  /**
   * The lexer that can be used to render nested tokens if needed
   */
  lexer: Lexer
}

export type TokenExtractor = (params: any) => any

/**
 * Container extension is a marked extension that parses a block of text surrounded by :::
 *
 * @param tokensExtractor Converts the container input into a custom token that svelte components will receive.
 * If this function returns a value that contains an array of `tokens`,
 * this array will be populated with the tokens that are found inside the container,
 * allowing to nest markdown inside the container.
 *
 * @example
 *
 * Given the following markdown:
 *
 * :::container option="option-1" option-2="option-2" boolean-option
 * Something inside the container
 * :::
 *
 * The token extractor would receive the following parameters:
 * **type**: `container`
 * **content**: `Something inside the container`
 * **options**: { 'option': 'option-1', 'option-2': 'option-2', 'boolean-option': true }
 */
export default function (tokensExtractor: any): any {
  return {
    name: 'container',
    level: 'block',
    start(src: any) {
      return src.match(/^:::[^:\n]/)?.index
    },
    tokenizer(src: any): any {
      const rule =
        /^:::[\s]?(?<type>[a-z0-9-]+)(?<options>.*)?\n(?<content>(?:.|\n)*)\n:::(?:\n|$)/i

      const match = rule.exec(findRawContainer(src))
      if (!match || !match.groups) return null

      const type = match.groups.type.toLocaleLowerCase()
      const options = parseOptions(match.groups.options || '')
      const content = match.groups.content || ''

      const result = tokensExtractor({
        type: type,
        content: content,
        raw: match[0],
        options: options,
        lexer: this.lexer,
      })

      if (result?.tokens) {
        this.lexer.blockTokens(content, result.tokens)
      }

      return result
    },
  }
}

function findRawContainer(src: any): any {
  if (!src.startsWith(':::')) return undefined
  const lines = src.split('\n')
  let open = 1
  let lineNumber = 1

  for (lineNumber = 1; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber]
    if (line.startsWith(':::')) {
      if (/:::[^:\n\s]/.test(line)) {
        open++
      } else if (/^:::(\n|$)/.test(line)) {
        open -= 1
      }
    }

    if (open === 0) {
      break
    }
  }

  return lines.slice(0, lineNumber + 1).join('\n')
}

function parseOptions(options: string): ContainerOptions {
  const output: any = {}
  let remaining = options

  while (true) {
    const regex = /(?<name>[a-z0-9]+)(?:="(?<value>(?:.*?))")?/i
    const match = regex.exec(remaining)
    if (!match) break

    const name = match?.groups?.name

    if (name) {
      output[name] = match?.groups?.value ?? true
    }

    remaining = remaining.slice(match.index + match[0].length)
  }

  return output
}
