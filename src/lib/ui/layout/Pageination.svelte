<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { page as pageData } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { Button } from 'mono-svelte'
  import { ChevronLeft, ChevronRight, Icon } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import { SvelteURLSearchParams } from 'svelte/reactivity'
  import { fly } from 'svelte/transition'

  interface Props {
    page?: number
    cursor?: { next?: string; back?: string } | undefined
    hasMore?: boolean
    children?: import('svelte').Snippet
    href?: (current: number | string) => string
    back?: boolean
  }

  let {
    page = $bindable(0),
    cursor = undefined,
    hasMore = true,
    children,
    href,
    back = true,
  }: Props = $props()

  let customHref = (href?: string) => {
    if (href?.startsWith('?')) {
      const current = new SvelteURLSearchParams(pageData.url.searchParams)
      const newParams = new SvelteURLSearchParams(href)

      current.delete(Array.from(newParams.keys())[0])
      current.append(
        Array.from(newParams.entries())[0][0],
        Array.from(newParams.entries())[0][1],
      )

      return `?${current.toString()}`
    } else return href
  }
</script>

{#if hasMore || page != 1}
  <nav
    aria-label={$t('aria.pagination.nav')}
    class={[
      'flex flex-row gap-2 items-center justify-center bg-white dark:bg-zinc-900',
      'border border-slate-200 dark:border-zinc-800 rounded-full overflow-hidden w-max mx-auto p-0.5',
      'shadow-md',
    ]}
  >
    {#if children}
      <span class="text-sm text-slate-600 dark:text-zinc-400 font-medium">
        {@render children?.()}
      </span>
      <hr class="border-slate-200 dark:border-zinc-800 flex-1" />
    {/if}
    {#if back}
      <Button
        href={customHref(href?.(cursor?.back ?? page - 1))}
        color="tertiary"
        onclick={() => invalidate(pageData.url)}
        title={$t('common.back')}
        rounding="pill"
        size="custom"
        class="text-inherit dark:text-inherit p-1"
        disabled={(cursor?.back == undefined && cursor?.next != undefined) ||
          page <= 1}
      >
        {#snippet suffix()}
          <Icon src={ChevronLeft} size="24" mini />
        {/snippet}
      </Button>
    {/if}

    {#if page}
      <div style="display: grid;">
        {#key page}
          <div
            in:fly={{ y: 8, easing: backOut, duration: 400, delay: 100 }}
            out:fly={{ y: 8, easing: backOut, duration: 400 }}
            class="text-lg font-medium"
            style="grid-column: 1; grid-row: 1;"
          >
            {page}
          </div>
        {/key}
      </div>
    {/if}

    <Button
      href={customHref(href?.(cursor?.next ?? page + 1))}
      color="tertiary"
      onclick={() => invalidate(pageData.url)}
      title={$t('common.next')}
      size="custom"
      rounding="pill"
      class="text-inherit dark:text-inherit p-1"
      disabled={!hasMore}
    >
      {#snippet suffix()}
        <Icon src={ChevronRight} size="24" mini />
      {/snippet}
    </Button>
  </nav>
{/if}
