<div
  class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center"
>
  <slot name="icon" />
  {#if $$slots.title}
    <h1 class="font-bold text-2xl"><slot name="title" /></h1>
  {/if}
  {#if $$slots.description}
    <p><slot name="description" /></p>
  {/if}
  <slot name="action" />
</div>
