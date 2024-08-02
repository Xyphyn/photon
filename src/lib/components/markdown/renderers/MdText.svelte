<script lang="ts">
  export let text: string
  export let raw: string

  console.log(raw)

  function preprocess(src: string): string {
    // superscript, subscript support
    src = src
      .replace(/~([^~]+)~/g, '<sub>$1</sub>')
      .replace(/\^([^^]+)\^/g, '<sup>$1</sup>')

    return src
  }

  $: processed = preprocess(raw)
</script>

{@html processed}
