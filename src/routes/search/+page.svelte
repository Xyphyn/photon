<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Comment from '$lib/components/lemmy/comment/Comment.svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import CommunityItem from '$lib/components/lemmy/community/CommunityItem.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import UserItem from '$lib/components/lemmy/user/UserItem.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { isComment, isCommunity, isPost, isUser } from '$lib/lemmy/item.js'
  import type {
    CommentView,
    CommunityView,
    PersonView,
    PostView,
  } from 'lemmy-js-client'
  import { Icon, MagnifyingGlass } from 'svelte-hero-icons'
  import { expoInOut, expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  type Result = PostView | CommentView | PersonView | CommunityView

  export let data

  let query = ''

  let pageNum = data.page
</script>

<svelte:head>
  <title>Search</title>
</svelte:head>

<div class="flex flex-row flex-wrap sm:justify-between items-center gap-4">
  <MultiSelect
    options={['All', 'Posts', 'Comments', 'Communities', 'Users']}
    selected={$page.url.searchParams.get('type') ?? 'All'}
    on:select={(e) => {
      const url = $page.url
      url.searchParams.set('type', e.detail)
      url.searchParams.delete('page')
      goto(url, {
        invalidateAll: true,
      })
    }}
  />
  <div class="flex flex-row gap-2 items-center">
    <TextInput
      bind:value={query}
      placeholder="Search for something..."
      on:change={() => {
        $page.url.searchParams.set('q', query)
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
    <Button
      on:click={() => {
        $page.url.searchParams.set('q', query)
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
      size="lg"
      class="h-full"
    >
      Search
    </Button>
  </div>
</div>
{#if !data.results}
  <div
    class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center py-8"
  >
    <Icon src={MagnifyingGlass} size="48" solid />
    <h1 class="font-bold text-3xl">No results</h1>
    <p class="mt-2 text-center">Search for something!</p>
  </div>
{:else}
  {#await data.streamed.object}
    <div
      class="flex gap-4 items-center mt-4"
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
  <div class="flex flex-col gap-4 mt-4">
    {#each data.results as result}
      {#if isPost(result)}
        <Post post={result} />
      {:else if isComment(result)}
        <CommentItem comment={result} />
      {:else if isCommunity(result)}
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
      on:change={(p) => {
        $page.url.searchParams.set('page', p.detail.toString())
        goto($page.url, {
          invalidateAll: true,
        })
      }}
    />
  {/if}
{/if}
