<script lang="ts">
  interface Props {
    class?: string
    children?: import('svelte').Snippet
  }

  let { class: clazz = '', children }: Props = $props()
</script>

<aside
  class="sticky top-0 left-0 break-words flex shrink
    flex-col gap-4 px-6 max-w-full w-full h-full
    overflow-auto text-sm border-slate-200 dark:border-zinc-800 {clazz}"
>
  {@render children?.()}
</aside>
