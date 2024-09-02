<script lang="ts">
  export let title: string
  export let id: string
</script>

<div
  class="flex flex-col min-w-0 divide-y divide-slate-200 dark:divide-zinc-800 *:py-3.5 max-w-full w-full"
>
  <h2 class="text-xl font-semibold text-inherit" {id}>{title}</h2>
  <slot />
</div>
