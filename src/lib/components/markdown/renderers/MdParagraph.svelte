<script>
  import { options } from '../Markdown.svelte'
</script>

<p class="leading-[1.5] {options.inline ? '' : 'max-w'}">
  <slot />
</p>

<style>
  .max-w {
    max-width: 80ch;
  }
</style>
