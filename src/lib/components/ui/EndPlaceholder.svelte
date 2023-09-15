<div
  class="flex flex-row items-center text-sm text-slate-600 dark:text-zinc-400 gap-2"
>
  <span class="font-medium">
    <slot />
  </span>
  <hr class="border-slate-200 flex-1 dark:border-zinc-800" />
  <slot name="action" />
</div>
