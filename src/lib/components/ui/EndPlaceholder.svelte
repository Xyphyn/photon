<div
  class="flex flex-col sm:flex-row items-center
   text-sm text-slate-600 dark:text-zinc-400 gap-2"
>
  <span class="font-medium text-center sm:text-left">
    <slot />
  </span>
  <hr class="border-slate-200 sm:flex-1 w-full dark:border-zinc-800" />
  <slot name="action" />
</div>
