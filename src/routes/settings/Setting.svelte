<script lang="ts">
  import { Material } from 'mono-svelte'
</script>

<Material color="distinct" padding="none" class="my-2">
  <div class="px-5 pt-5 flex flex-col gap-3" class:pb-5={!$$slots.default}>
    <h1 class="font-bold text-lg"><slot name="title" /></h1>
    {#if $$slots.description}
      <p class="text-slate-800 dark:text-zinc-200">
        <slot name="description" />
      </p>
    {/if}
  </div>
  {#if $$slots.default}
    <div
      class="w-full px-5 py-3 bg-slate-50 dark:bg-zinc-950 border-t dark:border-zinc-800 mt-4
      flex flex-col gap-2"
    >
      <slot />
    </div>
  {/if}
</Material>
