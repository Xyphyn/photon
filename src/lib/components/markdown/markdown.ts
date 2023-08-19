import MarkdownIt from 'markdown-it'
import markdown_it_container from 'markdown-it-container'
// @ts-ignore
import markdown_it_sub from 'markdown-it-sub'
// @ts-ignore
import markdown_it_sup from 'markdown-it-sup'

export const md = new MarkdownIt({
  html: false,
  linkify: true,
})
  .use(markdown_it_container, 'spoiler', {
    validate: (params: string) => {
      return params.trim().match(/^spoiler+(.*)/)
    },

    render: (tokens: any, idx: any) => {
      var m = tokens[idx].info.trim().match(/^spoiler+(.*)/)

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<details><summary> ${md.utils.escapeHtml(m[1])} </summary>\n`
      } else {
        // closing tag
        return '</details>\n'
      }
    },
  })
  .use(markdown_it_sub)
  .use(markdown_it_sup)

export const mdInline: MarkdownIt = new MarkdownIt('zero')
  .enable(['emphasis', 'backticks', 'strikethrough', 'link'])
  .use(markdown_it_container, 'spoiler', {
    validate: (params: string) => {
      return params.trim().match(/^spoiler+(.*)/)
    },

    render: (tokens: any, idx: any) => {
      var m = tokens[idx].info.trim().match(/^spoiler+(.*)/)

      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<details><summary> ${md.utils.escapeHtml(m[1])} </summary>\n`
      } else {
        // closing tag
        return '</details>\n'
      }
    },
  })
  .use(markdown_it_sub)
  .use(markdown_it_sup)

md.linkify.add('!', {
  validate: function (text, pos, self) {
    var tail = text.slice(pos)

    if (!self.re.community) {
      self.re.community = new RegExp(
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})/
      )
    }
    if (self.re.community.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === '!') {
        return false
      }
      return tail.match(self.re.community)![0].length
    }
    return 0
  },
  normalize: function (match) {
    match.url = `/c/${match.url.slice(1)}`
  },
})

md.linkify.add('@', {
  validate: function (text, pos, self) {
    var tail = text.slice(pos)

    if (!self.re.user) {
      self.re.user = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})/)
    }
    if (self.re.user.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === '@') {
        return false
      }
      return tail.match(self.re.user)![0].length
    }
    return 0
  },
  normalize: function (match) {
    match.url = `/u/${match.url.slice(1)}`
  },
})

md.linkify.add('https:', {
  validate: function (text, pos, self) {
    const tail = text.slice(pos)

    return tail.length
  },
  normalize: function (match) {
    const matched = match.url.match(/\/\/([\w-]+.[\w.]+)\/post\/(\d+)/)
    if (!matched?.[1] || !matched?.[2]) {
      return match
    }
    match.url = `/post/${matched?.[1]}/${matched?.[2]}`
    console.log(match)
  },
})
