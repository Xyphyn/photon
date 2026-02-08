import { marked, type TokenizerAndRendererExtension, type Tokens } from 'marked'
import markedLinkifyIt from 'marked-linkify-it'

export const spoilerPlugin: TokenizerAndRendererExtension = {
  name: 'spoiler',
  level: 'block',
  start(src: string) {
    return src.match(/:::/)?.index
  },
  tokenizer(src: string) {
    const rule = /::: ?spoiler(?: ?(.*))\n([\s\S]*?)\n:::/
    const match = rule.exec(src)
    if (match) {
      return {
        type: 'spoiler',
        raw: match[0],
        title: match[1].trim(),
        text: match[2].trim(),
        tokens: [],
      }
    }
  },
  renderer(token: Tokens.Generic) {
    return `
      <details>
        <summary>${marked.parseInline(token.title)}</summary>
        ${marked.parse(token.text)}
      </details>
    `
  },
}

export const linkify = (markedLinkifyIt as any)(
  {
    '!': {
      validate: function (text: string, pos: number, self: any) {
        const tail = text.slice(pos)

        if (!self.re.community) {
          self.re.community = new RegExp(
            /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z]{2,63})/i,
          )
        }
        if (self.re.community.test(tail)) {
          // Linkifier allows punctuation chars before prefix,
          // but we additionally disable `@` ("@@mention" is invalid)
          if (pos >= 2 && tail[pos - 2] === '!') {
            return false
          }
          const match = tail.match(self.re.community)
          return match ? match[0].length : 0
        }
        return 0
      },
      normalize: function (match: any) {
        let prefix = match.url
        prefix = prefix.startsWith('c/') ? prefix.slice(2) : prefix.slice(1)

        match.url = `/c/${prefix}`
      },
    },
    '@': {
      validate: function (text: string, pos: number, self: any) {
        const tail = text.slice(pos)

        if (!self.re.user) {
          self.re.user = new RegExp(
            /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z]{2,63})/i,
          )
        }
        if (self.re.user.test(tail)) {
          // Linkifier allows punctuation chars before prefix,
          // but we additionally disable `@` ("@@mention" is invalid)
          if (pos >= 2 && tail[pos - 2] === '!') {
            return false
          }
          const match = tail.match(self.re.user)
          return match ? match[0].length : 0
        }
        return 0
      },
      normalize: function (match: any) {
        let prefix = match.url
        prefix = prefix.startsWith('u/') ? prefix.slice(2) : prefix.slice(1)

        match.url = `/u/${prefix}`
      },
    },
  },
  {
    fuzzyEmail: false,
  },
)

const regexes = {
  post: /^https:\/\/([a-zA-Z0-9.-]+)\/post\/(\d+)$/i,
  comment: /^https:\/\/([a-zA-Z0-9.-]+)\/comment\/(\d+)$/i,
  user: /^https:\/\/([a-zA-Z0-9.-]+)(\/u\/)([a-zA-Z0-9.-_]+)$/i,
  community: /^https:\/\/([a-zA-Z0-9.-]+)(\/c\/)([a-zA-Z0-9.-_]+)$/i,
  implicitUser: /^mailto:([a-z0-9_.-]+)@(([\da-z.-]+)\.([a-z]{2,63}))/i,
}

export { regexes as CONTENT_REGEXES }

/**
 * Convert links to photon links
 */
export const photonify = (link: string) => {
  if (regexes.community.test(link)) {
    const match = link.match(regexes.community)
    if (!match) return

    // If the match[3] includes @, the URL included an instance already, so don't add one.
    if (match?.[3].includes('@')) return `/c/${match?.[3]}`
    else return `/c/${match?.[3]}@${match?.[1]}`
  }
  if (regexes.post.test(link)) {
    const match = link.match(regexes.post)
    if (!match) return
    return `/post/${match?.[1]}/${match?.[2]}`
  }
  if (regexes.comment.test(link)) {
    const match = link.match(regexes.comment)
    if (!match) return
    return `/comment/${match?.[1]}/${match?.[2]}`
  }
  if (regexes.user.test(link)) {
    const match = link.match(regexes.user)
    if (!match) return

    // Same as above for the community.
    if (match?.[3].includes('@')) return `/u/${match?.[3]}`
    else return `/u/${match?.[3]}@${match?.[1]}`
  }
  // Support implicit user syntax (no preceding @), by messing with mailto links.
  if (regexes.implicitUser.test(link)) {
    const exec = regexes.implicitUser.exec(link)

    if (!exec?.[1] || !exec?.[2]) return
    return `/u/${exec[1]}@${exec[2]}`
  }
}

export function subSupscriptExtension(
  tokensExtractor: (params: any) => Tokens.Generic | null,
): TokenizerAndRendererExtension {
  return {
    name: 'subscriptSuperscript',
    level: 'inline',
    start(src: string) {
      return src.match(/[~^]/)?.index
    },
    tokenizer(this: any, src: string) {
      const subscriptRule = /^~([^~\s](?:[^~]*[^~\s])?)~/
      const superscriptRule = /^\^([^^\s](?:[^^]*[^^\s])?)\^/

      let match

      if ((match = subscriptRule.exec(src))) {
        return (
          tokensExtractor({
            type: 'subscript',
            content: match[1],
            raw: match[0],
            lexer: this.lexer,
          }) ?? undefined
        )
      }

      if ((match = superscriptRule.exec(src))) {
        return (
          tokensExtractor({
            type: 'superscript',
            content: match[1],
            raw: match[0],
            lexer: this.lexer,
          }) ?? undefined
        )
      }
    },
  }
}
