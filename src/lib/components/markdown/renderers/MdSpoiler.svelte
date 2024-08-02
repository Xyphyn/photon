<script lang="ts">
  import { marked } from 'marked'

  export let raw: string

  function extractTitle(text: string) {
    const spoilerRegex = /^::: spoiler (.+)\n([\s\S]+?)\n:::/gm

    return text.replace(spoilerRegex, function (match, title, content) {
      return `<details><summary class="cursor-pointer">${marked.parseInline(title)}</summary>${marked.parse(content)}</details>`
    })
  }

  $: html = extractTitle(raw)
</script>

{@html html}
