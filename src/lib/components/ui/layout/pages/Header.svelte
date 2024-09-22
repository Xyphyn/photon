<script lang="ts">
  import { userSettings } from '$lib/settings'
  import { contentPadding } from '../Shell.svelte'

  export let pageHeader = false
</script>

<div
  class="
  {pageHeader
    ? `w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]
  bg-slate-50 dark:bg-zinc-950 -m-4 sm:-m-6 mb-0 sm:mb-0 sm:p-6 p-4
   border-b border-slate-200 dark:border-zinc-800`
    : ''}
  
  "
  style="{pageHeader
    ? `margin-top: min(-6rem, calc(-1 * calc(${$contentPadding.top}px))); padding-top: max(6rem, calc(${$contentPadding.top}px));`
    : ''} {$$props.style};
"
>
  <h1
    class="text-3xl font-medium flex gap-2 w-full
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
