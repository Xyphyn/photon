<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte'
</script>

<Card class="flex flex-col gap-3 p-6 text-sm my-2">
  <h1 class="font-bold"><slot name="title" /></h1>
  <p class="text-slate-700 dark:text-zinc-300">
    <slot name="description" />
  </p>
  <slot />
</Card>
