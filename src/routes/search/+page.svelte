<script lang="ts">
  import { page } from '$app/stores'
  import { profile } from '$lib/auth.js'
  import ObjectAutocomplete from '$lib/components/lemmy/ObjectAutocomplete.svelte'
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
  import { Button, Select, Spinner, TextInput } from 'mono-svelte'
  import {
    AdjustmentsHorizontal,
    Bars3BottomRight,
    Icon,
    MagnifyingGlass,
  } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  type Result = PostView | CommentView | PersonView | CommunityView

  export let data

  let query = data.query || ''

  let pageNum = data.page
</script>

<svelte:head>
  <title>Search</title>
</svelte:head>

<h1 class="font-bold text-2xl">Search</h1>
<div class="flex flex-row flex-wrap sm:justify-between items-center gap-4 mt-4">
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'All', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={AdjustmentsHorizontal} mini size="15" />
      Type
    </span>
    <option value="All">All</option>
    <option value="Posts">Posts</option>
    <option value="Comments">Comments</option>
    <option value="Communities">Communities</option>
    <option value="Users">Users</option>
  </Select>
  <div class="flex flex-row gap-2 items-center">
    <TextInput
      bind:value={query}
      placeholder="!community@instance.com"
      on:change={() => searchParam($page.url, 'q', query, 'page')}
    />
    <Button
      on:click={() => searchParam($page.url, 'q', query, 'page')}
      size="lg"
      class="h-full"
    >
      Search
    </Button>
  </div>
</div>
<div class="max-w-sm mt-2">
  <ObjectAutocomplete
    label="Community"
    jwt={$profile?.jwt}
    listing_type={'All'}
    showWhenEmpty={true}
    on:select={(c) =>
      searchParam($page.url, 'community', c.detail?.id || undefined, 'page')}
  />
</div>
{#if !data.results}
  <Placeholder
    icon={MagnifyingGlass}
    title="No results"
    description="Search across the fediverse"
  />
{:else}
  {#await data.streamed.object}
    <div
      class="flex gap-2 items-center mt-4"
      out:slide={{ axis: 'y', easing: expoOut }}
    >
      <Spinner width={24} />
      <span>Federating...</span>
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
