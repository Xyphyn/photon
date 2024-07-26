<script lang="ts">
  import { userSettings } from '$lib/settings'
  import { contentPadding } from '../Shell.svelte'
</script>

<div
  class="
  bg-slate-50 dark:bg-zinc-950 -m-4 sm:-m-6 mb-0 sm:mb-0 sm:p-6 p-4
   border-b border-slate-200 dark:border-zinc-800"
  style="margin-top: min(-1.5rem, calc(-1 * calc({$contentPadding.top}px)));
padding-top: max(1.5rem, calc({$contentPadding.top}px));"
>
  <h1
    class="text-3xl font-bold flex items-center gap-2
  {$userSettings.font == 'satoshi/nunito'
      ? 'font-display'
      : ''} {$$props.class ?? ''}"
  >
    <slot />
  </h1>
  {#if $$slots.extended}
    <div class="mt-4">
      <slot name="extended" />
    </div>
  {/if}
</div>
