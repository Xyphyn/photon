<script lang="ts">
  let { children } = $props()
</script>

<div
  class="fixed inset-0 bg-slate-50 dark:bg-zinc-925 z-50 p-8 sm:p-16 lg:p-24 overflow-auto"
>
  {@render children?.()}
</div>
