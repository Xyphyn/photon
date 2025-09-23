<script lang="ts">
  import { navigating, page } from '$app/state'
  import CommunityItem from '$comp/lemmy/community/CommunityItem.svelte'
  import EndPlaceholder from '$comp/ui/EndPlaceholder.svelte'
  import Fixate from '$comp/ui/generic/Fixate.svelte'
  import Skeleton from '$comp/ui/generic/Skeleton.svelte'
  import CommonList from '$comp/ui/layout/CommonList.svelte'
  import Pageination from '$comp/ui/layout/Pageination.svelte'
  import Placeholder from '$comp/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { Material } from 'mono-svelte'
  import { QuestionMarkCircle } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  let { data } = $props()

  let showTop = $derived(
    (data.query ?? '' != '') &&
      data.communities.value.length > 0 &&
      data.page == 1,
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
    {#if data.communities.value.length == 0}
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
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center mb-6 border-0!"
      >
        {#each data.communities.value.slice(0, 3) as community, index (community.community.id)}
          <div
            class="h-full"
            in:fly|global={{
              duration: 1000,
              easing: expoOut,
              delay: index < 20 ? index * 100 : 0,
              y: 16,
            }}
          >
            <Material color="uniform" padding="none" rounding="2xl">
              <CommunityItem
                {community}
                showCounts={false}
                class="w-full p-4 text-center"
                view="cozy"
              />
            </Material>
          </div>
        {/each}
      </div>
    {/if}

    {#if data.communities.value.slice(showTop ? 3 : 0).length > 0}
      <EndPlaceholder size="lg" margin="md">
        {$t('routes.search.other')}
      </EndPlaceholder>
    {/if}
    {#if data.communities.value}
      {@const sliced = data.communities.value.slice(showTop ? 3 : 0)}
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
{#if data.communities.value.length > 0}
  <Fixate placement="bottom">
    <Pageination
      page={Number(page.url.searchParams.get('page')) || 1}
      href={(c) => `?page=${c}`}
    />
  </Fixate>
{/if}
