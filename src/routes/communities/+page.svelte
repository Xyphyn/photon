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

  export let data

  let search = data.query || ''
  let instance = ''
</script>

<svelte:head>
  <title>Communities</title>
</svelte:head>

<Header>
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
<div class="flex flex-row flex-wrap gap-4 mt-4 items-center">
  <Location selected={data.type} />
  <Sort selected={data.sort} />
  <form
    on:submit|preventDefault={() => searchParam($page.url, 'q', search, 'page')}
    class="flex flex-col sm:flex-row gap-2 sm:ml-auto items-center"
  >
    <TextInput
      bind:value={search}
      label={$t('routes.search.query')}
      size="md"
    />
    <Button
      submit
      color="secondary"
      size="custom"
      class="self-end"
      style="width: 38px; height: 38px;"
      title="Search"
    >
      <Icon src={MagnifyingGlass} size="16" mini />
    </Button>
  </form>
</div>
<ul class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800">
  {#if data.communities.length == 0}
    <Placeholder
      icon={QuestionMarkCircle}
      title={$t('routes.search.noResults.title')}
      description={$t('routes.search.noResults.description')}
    />
  {/if}
  {#each data.communities as community}
    <CommunityItem {community} />
  {/each}
</ul>
{#if data.communities.length > 0}
  <div class="mt-2 w-full">
    <Pageination
      page={Number($page.url.searchParams.get('page')) || 1}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  </div>
{/if}
