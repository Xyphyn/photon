<script lang="ts">
  import Card from './Card.svelte'
</script>

<Card
  class="sticky top-20 border-l border-slate-200
    dark:border-zinc-800 break-words flex
    flex-col gap-4 p-6 w-[22rem] h-max max-h-[calc(100vh-6rem)]
    overflow-auto text-sm {$$props.class}"
>
  <slot />
</Card>
