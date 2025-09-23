<script>
  let { children } = $props()
</script>

<li>
  {@render children?.()}
</li>

<style>
  @reference '../../../../app.css';
  li::marker {
    color: var(--color-slate-400);
    @variant dark {
      color: var(--color-zinc-600);
    }
  }
</style>
