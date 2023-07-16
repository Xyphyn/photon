<script lang="ts">
  import { fly } from 'svelte/transition'

  let clazz = ''
  export { clazz as class }
</script>

<div
  class="bg-white border border-slate-200
    dark:border-zinc-800 dark:bg-zinc-900 break-words
    flex-col p-1 rounded-lg {clazz}"
>
  <slot />
</div>
