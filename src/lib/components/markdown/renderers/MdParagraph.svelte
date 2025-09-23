<script>
  let { children } = $props()
</script>

<p class="leading-[1.7] break-words max-w">
  {@render children?.()}
</p>

<style>
  .max-w {
    max-width: 70ch;
  }
</style>
