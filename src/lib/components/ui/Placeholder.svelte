<div
  class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center gap-1"
>
  {#if $$slots.icon}
    <div
      class="bg-slate-100 border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 p-3 rounded-full"
    >
      <slot name="icon" />
    </div>
  {/if}
  {#if $$slots.title}
    <h1 class="font-bold text-lg"><slot name="title" /></h1>
  {/if}
  {#if $$slots.description}
    <p class="text-sm text-center"><slot name="description" /></p>
  {/if}
  <slot name="action" />
</div>
