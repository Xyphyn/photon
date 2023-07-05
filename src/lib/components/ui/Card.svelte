<script lang="ts">
  let clazz = ''
  export { clazz as class }
</script>

<div
  class="bg-white shadow-lg border-slate-200
    dark:border-zinc-800 dark:bg-zinc-900 break-words
    flex-col p-1 rounded-md {clazz}"
>
  <slot />
</div>
