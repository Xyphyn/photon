<script lang="ts">
  import { Disclosure } from 'mono-svelte'

  export let raw: string

  function extractTitle(text: string) {
    const spoilerRegex = /^::: spoiler (.+)\n([\s\S]+?)\n:::/gm

    return text.replace(spoilerRegex, function (match, title, content) {
      return `<details><summary class="cursor-pointer">${title}</summary>${content}</details>`
    })
  }

  $: html = extractTitle(raw)
</script>

{@html html}
