<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    showLabel = false,
    children,
  }: { showLabel?: boolean; children: Snippet } = $props()
</script>

<div
  class="text-slate-800 dark:text-zinc-200 text-xs font-medium mx-3 my-1.5 flex items-center gap-1"
>
  <div class={[!showLabel && 'sr-only']}>{@render children?.()}</div>
  <hr
    class={[
      'shrink flex-1 border-slate-100 dark:border-zinc-800',
      !showLabel && '-mx-4',
    ]}
  />
</div>
