<script lang="ts">
  import { Material } from 'mono-svelte'
</script>

<Material padding="lg" class="flex flex-col gap-3 my-2">
  <h1 class="font-bold"><slot name="title" /></h1>
  {#if $$slots.description}
    <p class="text-slate-700 dark:text-zinc-300">
      <slot name="description" />
    </p>
  {/if}
  <slot />
</Material>
