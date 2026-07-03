<script lang="ts">
  import { navigating } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { proxify } from '$lib/app/util/reactivity.svelte'
  import { MultiCommunityModel } from '$lib/feature/community/community-model.svelte'
  import CommunityItem from '$lib/feature/community/CommunityItem.svelte'
  import { Listing } from '$lib/feature/feeds/listing.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Skeleton from '$lib/ui/generic/Skeleton.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Pageination } from '$lib/ui/layout'
  import { QuestionMarkCircle } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  let { data } = $props()

  let listing = $derived(new Listing(data.feeds, (i) => new MultiCommunityModel(i)))
  let params = $derived(proxify(data.params))
</script>

{#if navigating.to?.route.id == '/communities'}
  <div class="flex flex-col gap-3">
    {#each new Array(5) as _, index}
      {_}
      <div
        in:fly|global={{
          duration: 800,
          easing: expoOut,
          y: 12,
          delay: index * 100,
        }}
        style="width: {(1 / ((index + 1) % 3)) * 100}%"
      >
        <Skeleton />
      </div>
    {/each}
  </div>
{:else}
  <ul class="flex flex-col h-full">
    {#if listing.items.length == 0}
      <Placeholder
        icon={QuestionMarkCircle}
        title={$t('routes.search.noResults.title')}
        description={$t('routes.search.noResults.description')}
      />
    {/if}

    <CommonList items={listing.items}>
      {#snippet item(multi)}
        <CommunityItem community={multi} showCounts={false} />
      {/snippet}
    </CommonList>
  </ul>
{/if}
{#if params.next != null || params.prev != null}
  <Fixate placement="bottom">
    <Pageination
      cursor={{
        next: params.next,
        back: params.prev,
      }}
      hasMore={params.next != null}
      href={(cursor) => `?cursor=${cursor}`}
    />
  </Fixate>
{/if}
