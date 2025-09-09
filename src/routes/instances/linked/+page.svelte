<script lang="ts">
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { t } from '$lib/i18n/translations.js'
  import { Spinner, TextInput } from 'mono-svelte'
  import { Check } from 'svelte-hero-icons'

  let { data: passedData } = $props()
  let data = $state(passedData)

  let filter = $state('')

  let loading = $state(false)

  function triggerFilter(filter: string) {
    if (!passedData.linked) return
    loading = true
    data.linked = passedData.linked.filter((i) => i.domain.includes(filter))
    loading = false
  }
</script>

{#if data}
  <div class="flex flex-col gap-4">
    <form onsubmit={() => triggerFilter(filter)}>
      <TextInput label={$t('filter.filter')} bind:value={filter}></TextInput>
    </form>
    {#if data.linked && data.linked.length > 0}
      {#if loading}
        <Spinner />
      {/if}
      <VirtualList
        items={data.linked}
        useWindow={false}
        height={600}
        estimatedHeight={50}
        class="overflow-auto border rounded-2xl border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950
      divide-y divide-slate-200 dark:divide-zinc-900 w-full"
      >
        {#snippet item(index)}
          {#if data.linked[index]}
            <div
              class="flex justify-between items-center first:pt-0 last:pb-0 my-3 px-6"
            >
              <div class="flex flex-col">
                <span class="font-medium">{data.linked[index].domain}</span>
                <span
                  class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                >
                  {data.linked[index].software ?? 'Unknown'} • <RelativeDate
                    date={publishedToDate(data.linked[index].published)}
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
        title="No linked instances"
        description="This instance doesn't block any others."
      />
    {/if}
  </div>
{/if}
