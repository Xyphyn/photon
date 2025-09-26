<script lang="ts">
  import { t } from '$lib/app/i18n'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Spinner, TextInput } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import { Check } from 'svelte-hero-icons/dist'

  let { data: passedData } = $props()
  let data = $state(passedData)

  let filter = $state('')

  let loading = $state(false)

  function triggerFilter(filter: string) {
    if (!passedData.blocked) return
    loading = true
    data.blocked = passedData.blocked.filter((i) => i.domain.includes(filter))
    loading = false
  }
</script>

{#if data}
  <div class="flex flex-col gap-4">
    <form onsubmit={() => triggerFilter(filter)}>
      <TextInput label={$t('filter.filter')} bind:value={filter}></TextInput>
    </form>
    {#if data.blocked && data.blocked.length > 0}
      {#if loading}
        <Spinner />
      {/if}
      <VirtualList
        items={data.blocked}
        useWindow={false}
        height={600}
        estimatedHeight={50}
        class="overflow-auto border rounded-2xl border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950
      divide-y divide-slate-200 dark:divide-zinc-900 w-full"
      >
        {#snippet item(index)}
          {#if data.blocked[index]}
            <div
              class="flex justify-between items-center first:pt-0 last:pb-0 my-3 px-6"
            >
              <div class="flex flex-col">
                <span class="font-medium">{data.blocked[index].domain}</span>
                <span
                  class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                >
                  {data.blocked[index].software ?? 'Unknown'} • <RelativeDate
                    date={publishedToDate(data.blocked[index].published)}
                  />
                </span>
              </div>
            </div>
          {/if}
        {/snippet}
      </VirtualList>
    {:else}
      <Placeholder
        icon={Check}
        title="No blocked instances"
        description="This instance likely has federation disabled."
      />
    {/if}
  </div>
{/if}
