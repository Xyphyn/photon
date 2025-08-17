<script lang="ts">
  interface Props {
    class?: string
    children?: import('svelte').Snippet
    action?: import('svelte').Snippet
  }

  let { class: clazz = '', children, action }: Props = $props()
</script>

<div
  class="flex flex-row items-center
   text-sm text-slate-600 dark:text-zinc-400 gap-2 flex-wrap {clazz}"
>
  <span class="font-medium text-left">
    {@render children?.()}
  </span>
  <div class="flex-1"></div>
  {@render action?.()}
</div>
