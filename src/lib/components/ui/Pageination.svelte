<script lang="ts">
  import { t } from '$lib/translations'
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
  export let cursor: { next?: string; back?: string } | undefined = undefined

  const dispatcher = createEventDispatcher<{ change: number; cursor: string }>()
</script>

<div class="flex flex-row w-full gap-4 items-center">
  {#if $$slots.default}
    <span class="text-sm text-slate-600 dark:text-zinc-400 font-medium">
      <slot />
    </span>
    <hr class="border-slate-200 dark:border-zinc-800 flex-1" />
  {/if}
  {#if cursor?.back}
    <Button
      on:click={() => {
        if (cursor?.back) dispatcher('cursor', cursor.back)
        else dispatcher('change', --page)
      }}
      disabled={page <= 1}
      class={$$slots.default ? '' : 'flex-1'}
    >
      <Icon src={ChevronLeft} size="18" mini slot="prefix" />
      {$t('common.back')}
    </Button>
  {/if}

  <Button
    on:click={() => {
      if (cursor?.next) dispatcher('cursor', cursor?.next)
      else dispatcher('change', ++page)
    }}
    class={$$slots.default ? '' : 'flex-1'}
  >
    {$t('common.next')}
    <Icon src={ChevronRight} size="18" mini slot="suffix" />
  </Button>
</div>
