import MarkdownIt from 'markdown-it'

export const md = new MarkdownIt({
  html: false,
  linkify: true,
})
