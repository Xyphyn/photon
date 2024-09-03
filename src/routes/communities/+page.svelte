<script lang="ts">
  import { page } from '$app/stores'
  import {
    GlobeAmericas,
    Icon,
    InformationCircle,
    MagnifyingGlass,
    QuestionMarkCircle,
  } from 'svelte-hero-icons'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { searchParam } from '$lib/util.js'
  import { Button, Material, Popover, Select, TextInput } from 'mono-svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import CommunityItem from '$lib/components/lemmy/community/CommunityItem.svelte'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { contentPadding } from '$lib/components/ui/layout/Shell.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'

  export let data

  let search = data.query || ''
  let instance = ''

  let virtualList: HTMLDivElement
  let offset: number = 0
</script>

<svelte:window bind:scrollY={offset} />

<svelte:head>
  <title>{$t('routes.communities')}</title>
</svelte:head>

<Header pageHeader class="justify-between">
  <span>{$t('routes.communities')}</span>
  <Popover
    openOnHover
    class="!inline-flex"
    targetClass="inline"
    placement="bottom"
  >
    <Icon
      src={InformationCircle}
      size="20"
      mini
      slot="target"
      class="!inline"
    />
    <Material slot="popover" color="distinct" class="w-72">
      <p class="font-normal">
        Can't find a community on your home instance? Go to the <a
          href="/search"
          class="text-blue-500 hover:underline"
        >
          search
        </a>
        page, and search with this syntax:
        <code>!community@instance.com</code>
      </p>
    </Material>
  </Popover>
</Header>
<div
  class="mt-4 mb-0 sticky z-30"
  style="top: max(1.5rem, {$contentPadding.top}px);"
>
  <Tabs routes={[]} class="p-2 dark:bg-zinc-925/70 shadow-md shadow-black/5">
    <form
      on:submit|preventDefault={() =>
        searchParam($page.url, 'q', search, 'page')}
      class="flex gap-2 flex-row items-center w-full text-base h-10"
    >
      <TextInput
        bind:value={search}
        aria-label={$t('routes.search.query')}
        size="lg"
        class="flex-1 !rounded-full h-full !text-base"
      />
      <Button
        submit
        color="secondary"
        size="custom"
        class="flex-shrink-0 h-full aspect-square"
        title="Search"
        rounding="pill"
      >
        <Icon src={MagnifyingGlass} size="16" mini />
      </Button>
    </form>
  </Tabs>
</div>
<div class="flex flex-row flex-wrap gap-4 mt-4 items-center">
  <Location selected={data.type} />
  <Sort selected={data.sort} />
</div>
<ul
  class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800 my-6 h-full"
>
  {#if data.communities.length == 0}
    <Placeholder
      icon={QuestionMarkCircle}
      title={$t('routes.search.noResults.title')}
      description={$t('routes.search.noResults.description')}
    />
  {/if}

  {#if (data.query ?? '' != '') && data.communities.length > 0}
    <SectionTitle class="!border-0 pb-2">
      {$t('routes.search.top')}
    </SectionTitle>
    <div
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center mb-6 !border-0"
    >
      {#each data.communities.slice(0, 3) as community}
        <Material
          color="distinct"
          padding="none"
          rounding="xl"
          class="dark:border-t-zinc-800 h-full"
        >
          <CommunityItem
            {community}
            showCounts={false}
            class="w-full p-4 text-center"
            view="cozy"
          />
        </Material>
      {/each}
    </div>
  {/if}

  {#if data.communities.slice(data.query ?? '' != '' ? 3 : 0).length > 0}
    <SectionTitle class="!border-0 pb-2">
      {$t('routes.search.other')}
    </SectionTitle>
  {/if}
  {#if data.communities}
    {@const sliced = data.communities.slice(data.query ?? '' != '' ? 3 : 0)}
    <div class="-mx-4 sm:-mx-6 h-full" bind:this={virtualList}>
      {#each sliced as community}
        <div
          class="px-6 hover:bg-slate-100 hover:dark:bg-zinc-900 transition-colors @container
        border-b border-slate-100 dark:border-zinc-800"
        >
          <CommunityItem {community} showCounts={false} class="py-3" />
        </div>
      {/each}
    </div>
  {/if}
</ul>
{#if data.communities.length > 0}
  <div
    class="sticky z-30 mx-auto max-w-full"
    style="bottom: max(1.5rem, {$contentPadding.bottom}px);"
  >
    <Tabs routes={[]} class="mx-auto">
      <Pageination
        page={Number($page.url.searchParams.get('page')) || 1}
        on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      />
    </Tabs>
  </div>
{/if}
