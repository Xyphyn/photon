<script lang="ts">
  import { page } from '$app/stores'
  import { profile } from '$lib/auth.js'
  import ObjectAutocomplete from '$lib/components/lemmy/ObjectAutocomplete.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import CommunityItem from '$lib/components/lemmy/community/CommunityItem.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import UserItem from '$lib/components/lemmy/user/UserItem.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import {
    isCommentView,
    isCommunityView,
    isPostView,
    isUser,
  } from '$lib/lemmy/item.js'
  import { userSettings } from '$lib/settings.js'
  import { searchParam } from '$lib/util.js'
  import type {
    CommentView,
    CommunityView,
    PersonView,
    PostView,
  } from 'lemmy-js-client'
  import { Button, Disclosure, Select, Spinner, TextInput } from 'mono-svelte'
  import {
    AdjustmentsHorizontal,
    Bars3BottomRight,
    ChevronDown,
    Icon,
    MagnifyingGlass,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

  type Result = PostView | CommentView | PersonView | CommunityView

  export let data

  let query = data.query || ''

  let pageNum = data.page

  let moreOptions = false
</script>

<svelte:head>
  <title>{$t('routes.search.title')}</title>
</svelte:head>

<Header pageHeader>
  {$t('routes.search.title')}
  <form
    on:submit|preventDefault={() => searchParam($page.url, 'q', query, 'page')}
    class="flex flex-row gap-2 items-center"
    slot="extended"
  >
    <TextInput
      bind:value={query}
      aria-label={$t('routes.search.query')}
      size="md"
      class="flex-1 rounded-lg"
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
</Header>
<div class="flex flex-row flex-wrap items-center gap-4 mt-4">
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'All', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={AdjustmentsHorizontal} mini size="15" />
      {$t('filter.type')}
    </span>
    <option value="All">{$t('content.all')}</option>
    <option value="Posts">{$t('content.posts')}</option>
    <option value="Comments">{$t('content.comments')}</option>
    <option value="Communities">{$t('content.communities')}</option>
    <option value="Users">{$t('content.users')}</option>
  </Select>
  <Sort navigate bind:selected={data.sort} />
  <Button
    slot="summary"
    size="square-lg"
    color="tertiary"
    class="self-end justify-self-center"
    on:click={() => (moreOptions = !moreOptions)}
  >
    <Icon src={ChevronDown} size="20" mini />
  </Button>
</div>
{#if moreOptions}
  <div transition:slide={{ axis: 'y', easing: expoOut }} class="max-w-sm">
    <ObjectAutocomplete
      label={$t('nav.create.community')}
      jwt={$profile?.jwt}
      listing_type={'All'}
      showWhenEmpty={true}
      on:select={(c) =>
        searchParam($page.url, 'community', c.detail?.id || undefined, 'page')}
    />
  </div>
{/if}
{#if !data.results}
  <Placeholder
    icon={MagnifyingGlass}
    title={$t('routes.search.noResults.title')}
    description={query == ''
      ? $t('routes.search.noResults.alt')
      : $t('routes.search.noResults.description')}
    class="pt-4"
  />
{:else}
  {#await data.streamed.object}
    <div
      class="flex gap-2 items-center mt-4"
      out:slide={{ axis: 'y', easing: expoOut }}
    >
      <Spinner width={24} />
      <span>{$t('routes.search.federating')}</span>
    </div>
  {:then object}
    {#if object}
      <div transition:slide={{ axis: 'y', easing: expoOut }}>
        {#if object.community}
          <CommunityItem community={object.community} />
        {/if}
        {#if object.post}
          <Post post={object.post} />
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
  <div
    class="flex flex-col mt-4 divide-slate-200 dark:divide-zinc-800"
    class:!divide-y={$userSettings.view != 'card'}
    class:gap-4={$userSettings.view == 'card'}
  >
    {#each data.results as result}
      {#if isPostView(result)}
        <Post post={result} />
      {:else if isCommentView(result)}
        <CommentItem comment={result} />
      {:else if isCommunityView(result)}
        <CommunityItem community={result} />
      {:else if isUser(result)}
        <UserItem user={result} />
      {/if}
    {/each}
  </div>
  <div class="mt-4" />
  {#if data.results.length > 0}
    <Pageination
      bind:page={pageNum}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  {/if}
{/if}
