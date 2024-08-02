<script lang="ts">
  export let raw: string

  function preprocess(src: string): string {
    // superscript, subscript support
    src = src
      .replaceAll(/~([^~]+)~/g, '<sub>$1</sub>')
      .replaceAll(/\^([^^]+)\^/g, '<sup>$1</sup>')

    return src
  }

  $: processed = preprocess(raw)
</script>

{@html processed}
