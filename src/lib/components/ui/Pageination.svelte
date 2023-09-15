<script lang="ts">
  import { Button } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Icon,
  } from 'svelte-hero-icons'

  export let page: number

  const dispatcher = createEventDispatcher<{ change: number }>()
</script>

<div class="flex flex-row w-full gap-4 items-center">
  {#if $$slots.default}
    <span class="text-sm text-slate-600 dark:text-zinc-400 font-medium">
      <slot />
    </span>
    <hr class="border-slate-200 dark:border-zinc-800 flex-1" />
  {/if}
  <Button
    on:click={() => {
      dispatcher('change', --page)
    }}
    disabled={page <= 1}
    class={$$slots.default ? '' : 'flex-1'}
  >
    <Icon src={ChevronLeft} size="18" mini slot="prefix" />
    Back
  </Button>

  <Button
    on:click={() => {
      dispatcher('change', ++page)
    }}
    class={$$slots.default ? '' : 'flex-1'}
  >
    Next
    <Icon src={ChevronRight} size="18" mini slot="suffix" />
  </Button>
</div>
