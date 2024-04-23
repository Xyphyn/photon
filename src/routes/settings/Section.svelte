<script lang="ts">
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'

  export let title: string
</script>

<div
  class="flex flex-col min-w-0 divide-y divide-slate-200 dark:divide-zinc-800
[&>*]:py-4 max-w-full w-full"
>
  <SectionTitle class="text-xl text-inherit">{title}</SectionTitle>
  <slot />
</div>
