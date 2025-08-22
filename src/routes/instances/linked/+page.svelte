<script lang="ts">
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { Material, Popover } from 'mono-svelte'
  import { Check, Icon, InformationCircle } from 'svelte-hero-icons'

  let { data } = $props()
</script>

{#if data}
  <div class="flex flex-col md:flex-row gap-4">
    <Material
      class="h-full overflow-auto divide-y *:py-3 divide-slate-200 dark:divide-zinc-800 max-h-[48rem] w-full"
    >
      {#if data.linked && data.linked.length > 0}
        <VirtualList
          useWindow={false}
          items={data.linked}
          height={473}
          estimatedHeight={100}
        >
          {#snippet item(index)}
            <div
              class="flex justify-between items-center first:pt-0 last:pb-0 my-3"
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
          {/snippet}
        </VirtualList>
      {:else}
        <Placeholder
          icon={Check}
          title="No linked instances"
          description="This instance likely has federation disabled."
        />
      {/if}
    </Material>
  </div>
{/if}
