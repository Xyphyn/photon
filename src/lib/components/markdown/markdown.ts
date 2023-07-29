import MarkdownIt from 'markdown-it'
import markdown_it_container from 'markdown-it-container'

export const md = new MarkdownIt({
  html: false,
  linkify: true,
}).use(markdown_it_container, 'spoiler', {
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

export const mdInline: MarkdownIt = new MarkdownIt('zero').enable([
  'emphasis',
  'backticks',
  'strikethrough',
  'link',
])

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
