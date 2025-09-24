<script>
  import { getContext } from 'svelte'

  let { children } = $props()

  const options = getContext('options')
</script>

<p class={[!options.inline && 'leading-[1.7] break-words max-w']}>
  {@render children?.()}
</p>

<style>
  .max-w {
    max-width: 70ch;
  }
</style>
