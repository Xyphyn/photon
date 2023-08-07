<div
  class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center gap-1"
>
  <slot name="icon" />
  {#if $$slots.title}
    <h1 class="font-bold text-3xl"><slot name="title" /></h1>
  {/if}
  {#if $$slots.description}
    <p class="text-lg"><slot name="description" /></p>
  {/if}
  <slot name="action" />
</div>
