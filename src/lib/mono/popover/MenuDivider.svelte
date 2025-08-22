<script lang="ts">
  let { children } = $props()
</script>

<div
  class="text-slate-800 dark:text-zinc-200 text-xs font-medium m-3 my-2 mb-1 flex items-center gap-1"
>
  <div class="sr-only">{@render children?.()}</div>
  <hr
    class="shrink flex-1 border-slate-100 dark:border-zinc-800 border-opacity-70 -mx-4"
  />
</div>
