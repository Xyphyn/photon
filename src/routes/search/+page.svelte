<script lang="ts">
  import { navigating, page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import { client } from '$lib/client/lemmy.svelte'
  import ObjectAutocomplete from '$comp/lemmy/ObjectAutocomplete.svelte'
  import Sort from '$comp/lemmy/dropdowns/Sort.svelte'
  import { PostItem } from '$comp/lemmy/post'
  import UserItem from '$comp/lemmy/user/UserItem.svelte'
  import Placeholder from '$comp/ui/Placeholder.svelte'
  import Skeleton from '$comp/ui/generic/Skeleton.svelte'
  import { CommonList, Header, SearchBar } from '$comp/ui/layout'
  import Pageination from '$comp/ui/layout/Pageination.svelte'
  import { t } from '$lib/i18n/translations.js'
  import {
    isCommentView,
    isCommunityView,
    isPostView,
    isUser,
  } from '$lib/lemmy/item.js'
  import { searchParam } from '$lib/util.svelte.js'
  import { Button, Option, Select, TextLoader } from 'mono-svelte'
  import {
    AdjustmentsHorizontal,
    ChevronDoubleDown,
    GlobeAmericas,
    Icon,
    MagnifyingGlass,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'
  import CommunityItem from '$comp/lemmy/community/CommunityItem.svelte'
  import CommentItem from '$comp/lemmy/comment/CommentItem.svelte'

  let { data } = $props()

  let searchElement: HTMLInputElement | undefined = $state()
  let form = $state<HTMLFormElement>()

  let moreOptions = $state(false)
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.target == document.body) searchElement?.focus()
  }}
/>

<svelte:head>
  <title>{$t('routes.search.title')}</title>
</svelte:head>

<Header pageHeader>
  {$t('routes.search.title')}
  {#snippet extended()}
    {@const clientType = client().type.name}
    <form method="get" action="/search" class="contents" bind:this={form}>
      <SearchBar bind:query={data.filters.value.query} />
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Select
          name="type"
          bind:value={data.filters.value.type}
          onchange={() => form?.requestSubmit()}
        >
          {#snippet customLabel()}
            <span class="flex items-center gap-1">
              <Icon src={AdjustmentsHorizontal} mini size="15" />
              {$t('filter.type')}
            </span>
          {/snippet}
          {#if clientType == 'lemmy'}
            <Option value="All">{$t('content.all')}</Option>
          {/if}
          <Option value="Posts">{$t('content.posts')}</Option>
          {#if clientType == 'lemmy'}
            <Option value="Comments">{$t('content.comments')}</Option>
          {/if}
          <Option value="Communities">{$t('content.communities')}</Option>
          <Option value="Users">{$t('content.users')}</Option>
          <Option value="Url">{$t('content.url')}</Option>
        </Select>
        <Sort
          name="sort"
          bind:selected={data.filters.value.sort}
          onchange={() => form?.requestSubmit()}
        />
        <Button
          size="custom"
          rounding="xl"
          class="self-end justify-self-center h-8.5 w-8.5"
          onclick={() => (moreOptions = !moreOptions)}
          aria-label={$t('post.actions.more.label')}
        >
          <Icon src={ChevronDoubleDown} size="20" mini />
        </Button>
      </div>
    </form>
  {/snippet}
</Header>

{#if moreOptions}
  <div
    transition:slide={{ axis: 'y', easing: expoOut, duration: 500 }}
    class="flex flex-row gap-2 flex-wrap"
  >
    <ObjectAutocomplete
      label={$t('nav.create.community')}
      jwt={profile.current?.jwt}
      listing_type="All"
      showWhenEmpty={true}
      onselect={(c) =>
        searchParam(page.url, 'community', c?.id || undefined, 'page')}
    />
  </div>
{/if}
{#if !data.results}
  {#if navigating.to?.route.id == '/search'}
    <div class="flex flex-col gap-3 mt-6">
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
    <div class="my-auto">
      <Placeholder
        icon={data.results ? MagnifyingGlass : GlobeAmericas}
        title={$t('routes.search.noResults.title')}
        description={data.results
          ? $t('routes.search.noResults.description')
          : $t('routes.search.noResults.alt')}
      />
    </div>
  {/if}
{:else}
  {#await data.streamed.object}
    <div
      class="flex gap-2 items-center my-4"
      out:slide={{ axis: 'y', easing: expoOut }}
    >
      <TextLoader>{$t('routes.search.federating')}</TextLoader>
    </div>
  {:then object}
    {#if object}
      <div
        transition:slide={{ axis: 'y', easing: expoOut }}
        class="divide-y divide-slate-200 dark:divide-zinc-900 my-4"
      >
        {#if object.community}
          <CommunityItem community={object.community} showCounts={false} />
        {/if}
        {#if object.post}
          <PostItem post={object.post} />
        {/if}
        {#if object.comment}
          <CommentItem comment={object.comment} />
        {/if}
        {#if object.person}
          <UserItem user={object.person} />
        {/if}
      </div>
    {/if}
  {/await}
  <CommonList items={data.results.value}>
    {#snippet item(result)}
      {#if isPostView(result)}
        <PostItem post={result} />
      {:else if isCommentView(result)}
        <CommentItem comment={result} />
      {:else if isCommunityView(result)}
        <CommunityItem community={result} showCounts={false} />
      {:else if isUser(result)}
        <UserItem user={result} showCounts={false} />
      {/if}
    {/snippet}
  </CommonList>
  <div class="mt-4"></div>
  {#if data.results.value.length > 0}
    <Pageination
      bind:page={data.filters.value.page}
      href={(page) => `?page=${page}`}
    />
  {/if}
{/if}
