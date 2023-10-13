<div class="flex flex-row items-center w-full justify-between gap-4">
  <div class="flex flex-col gap-0.5 flex-1 {$$props.class}">
    <h1 class="font-medium text-base"><slot name="title" /></h1>
    {#if $$slots.description}
      <p class="text-slate-800 dark:text-zinc-200 text-sm">
        <slot name="description" />
      </p>
    {/if}
  </div>
  {#if $$slots.default}
    <div
      class="w-full flex flex-col gap-2 flex-1 items-end {$$props.optionClass}"
    >
      <slot />
    </div>
  {/if}
</div>
