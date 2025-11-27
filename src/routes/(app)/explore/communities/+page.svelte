<script lang="ts">
  import { navigating, page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import CommunityItem from '$lib/feature/community/CommunityItem.svelte'
  import CommunityItemBig from '$lib/feature/community/CommunityItemBig.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Skeleton from '$lib/ui/generic/Skeleton.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Pageination } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { Material } from 'mono-svelte'
  import { QuestionMarkCircle } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  let { data } = $props()

  let showTop = $derived(
    (data.query ?? '' != '') && data.communities.length > 0 && data.page == 1,
  )
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
    {#if data.communities.length == 0}
      <Placeholder
        icon={QuestionMarkCircle}
        title={$t('routes.search.noResults.title')}
        description={$t('routes.search.noResults.description')}
      />
    {/if}

    {#if showTop}
      <EndPlaceholder size="lg" margin="md">
        {$t('routes.search.top')}
      </EndPlaceholder>
      <div
        class="grid md:grid-cols-2 xl:grid-cols-3 gap-4 items-center border-0!"
      >
        {#each data.communities.slice(0, 3) as community, index (community.community.id)}
          <div
            class="h-full"
            in:fly|global={{
              duration: 1000,
              easing: expoOut,
              delay: index < 20 ? index * 100 : 0,
              y: 16,
            }}
          >
            <Material padding="none" rounding="3xl" class="h-full">
              <CommunityItemBig {community} />
            </Material>
          </div>
        {/each}
      </div>
    {/if}

    {#if data.communities.slice(showTop ? 3 : 0).length > 0}
      <EndPlaceholder size="lg" margin="md">
        {$t('routes.search.other')}
      </EndPlaceholder>
    {/if}
    {#if data.communities}
      {@const sliced = data.communities.slice(showTop ? 3 : 0)}
      <CommonList items={sliced}>
        {#snippet item(community)}
          <CommunityItem
            {community}
            resolveObject={data.type.startsWith('instance-')}
            showCounts={false}
          />
        {/snippet}
      </CommonList>
    {/if}
  </ul>
{/if}
<Fixate placement="bottom">
  <Pageination
    page={Number(page.url.searchParams.get('page')) || 1}
    href={(c) => `?page=${c}`}
    hasMore={data.communities.length >= 40}
  />
</Fixate>
