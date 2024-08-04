<div
  class="flex flex-row items-center
   text-sm text-slate-600 dark:text-zinc-400 gap-2 flex-wrap {$$props.class ||
    ''}"
>
  <span class="font-medium text-left">
    <slot />
  </span>
  <hr class="border-slate-200 flex-1 w-full dark:border-zinc-800" />
  <slot name="action" />
</div>
