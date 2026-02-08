import type { TokenizerAndRendererExtension, Tokens } from 'marked'

/**
 * spoiler extension for marked
 */
export default function (
  tokensExtractor: (params: any) => Tokens.Generic | null,
): TokenizerAndRendererExtension {
  return {
    name: 'spoiler',
    level: 'block',
    start(src: string) {
      return src.match(/:::[^:\n]/)?.index
    },
    tokenizer(this: any, src: string) {
      const rule =
        /^:::[ \t]*spoiler[ \t]*([^\n]*)\n([\s\S]*?)\n[ \t]*:::[ \t]*(?:\n|$)/
      const match = rule.exec(src)

      if (match) {
        const title = match[1].trim()
        const content = match[2].trim()

        const options = parseOptions(title)

        const result = tokensExtractor({
          type: 'spoiler',
          raw: match[0],
          content: content,
          options: options,
          lexer: this.lexer,
        })

        if (result?.tokens) {
          this.lexer.blockTokens(content, result.tokens)
        }

        return result ?? undefined
      }
    },
  }
}

function parseOptions(options: string) {
  const output: Record<string, string | boolean> = {}

  const rule = /([a-z0-9]+)(?:="([^"]*)")?/gi
  let match
  while ((match = rule.exec(options)) !== null) {
    const name = match[1]
    if (name) {
      output[name] = match?.groups?.value ?? true
    }
  }

  return output
}
