<script lang="ts">
  let clazz = ''
  export { clazz as class }
</script>

<div
  class="bg-white border border-slate-200
    dark:border-zinc-800 dark:bg-zinc-900 break-words
    flex-col gap-4 p-4 rounded-md {clazz}"
>
  <slot />
</div>
