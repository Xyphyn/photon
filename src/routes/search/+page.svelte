<script lang="ts">
  import { navigating, page } from '$app/state'
  import {
    type CommentView,
    type CommunityView,
    type PersonView,
    type PostView,
    type SearchResponse,
    type SearchType,
  } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { searchParam, withParams } from '$lib/app/util.svelte'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import { CommentModel } from '$lib/feature/comment/comment.svelte.js'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import CommunityItem from '$lib/feature/community/CommunityItem.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte.js'
  import { PostItem } from '$lib/feature/post'
  import UserAutocomplete from '$lib/feature/user/UserAutocomplete.svelte'
  import UserItem from '$lib/feature/user/UserItem.svelte'
  import ObjectAutocomplete from '$lib/ui/form/ObjectAutocomplete.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Skeleton from '$lib/ui/generic/Skeleton.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination, SearchBar } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { Menu, Option, Select } from 'mono-svelte'
  import Button from 'mono-svelte/button/Button.svelte'
  import type { Component } from 'svelte'
  import {
    AdjustmentsHorizontal,
    BarsArrowDown,
    ChevronRight,
    GlobeAmericas,
    Icon,
    MagnifyingGlass,
  } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  let { data } = $props()

  let results = $derived(data.results)
  let params = $derived(proxify(data.params))

  let empty = $derived(
    results.comments.length == 0 &&
      results.posts.length == 0 &&
      results.communities.length == 0 &&
      results.persons.length == 0,
  )

  let searchElement: HTMLInputElement | undefined = $state()
  let form = $state<HTMLFormElement>()

  // wtf
  type Unpacked<T> = T extends (infer U)[] ? U : T
  type SectionKey = 'posts' | 'comments' | 'communities' | 'persons'
  type Section<K extends SectionKey, TProps extends Record<string, any>> = {
    type: 'posts' | 'comments' | 'communities' | 'users'
    key: K
    props: (item: Unpacked<SearchResponse[K]>) => TProps
    component: Component<TProps>
  }
  type AnySection = {
    [K in SectionKey]: Section<K, any>
  }[SectionKey]
  const sections: AnySection[] = [
    {
      type: 'posts',
      key: 'posts',
      component: PostItem,
      props: (post: PostView) => ({ post: repos.posts.get(post), view: 'compact' }),
    },
    {
      type: 'comments',
      key: 'comments',
      component: CommentItem,
      props: (comment: CommentView) => ({ comment: new CommentModel(comment) }),
    },
    {
      type: 'communities',
      key: 'communities',
      component: CommunityItem,
      props: (community: CommunityView) => ({ community: repos.communities.get(community) }),
    },
    {
      type: 'users',
      key: 'persons',
      component: UserItem,
      props: (user: PersonView) => ({ showCounts: false, user }),
    },
  ]
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
    <form method="get" action="/search" class="contents" bind:this={form}>
      <SearchBar bind:query={params.query} />
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Select name="type" value={params.type}>
          {#snippet customLabel()}
            <span class="flex items-center gap-1">
              <Icon src={AdjustmentsHorizontal} mini size="15" />
              {$t('filter.type')}
            </span>
          {/snippet}
          <Option value="all">{$t('content.all')}</Option>
          <Option value="posts">{$t('content.posts')}</Option>
          <Option value="comments">{$t('content.comments')}</Option>
          <Option value="communities">{$t('content.communities')}</Option>
          <Option value="users">{$t('content.users')}</Option>
        </Select>
        <Menu placement="bottom">
          {#snippet target(attachment)}
            <Button
              {@attach attachment}
              aria-label={$t('post.actions.more.label')}
              icon={BarsArrowDown}
              size="custom"
              class="self-end h-8.5 aspect-square"
            />
          {/snippet}
          {@render extraOptions()}
        </Menu>
      </div>
    </form>
  {/snippet}
</Header>

{#snippet extraOptions()}
  <ObjectAutocomplete
    label={$t('nav.create.community')}
    onselect={(c) => searchParam(page.url, 'community', c?.community.id || undefined, 'page')}
  />
  <UserAutocomplete
    label={$t('post.actions.more.creator')}
    listing_type="all"
    showWhenEmpty={true}
    onselect={(c) => searchParam(page.url, 'creator', c?.id.toString() ?? '', 'page')}
  />
{/snippet}

{#if empty}
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
        icon={params.query ? MagnifyingGlass : GlobeAmericas}
        title={$t('routes.search.noResults.title')}
        description={params.query
          ? $t('routes.search.noResults.description')
          : $t('routes.search.noResults.alt')}
      />
    </div>
  {/if}
{:else}
  {#if results?.resolve}
    <div
      transition:slide={{ axis: 'y', easing: expoOut }}
      class="divide-y divide-slate-200 dark:divide-zinc-900 my-4"
    >
      {#if results.resolve.type_ == 'community'}
        <CommunityItem community={repos.communities.get(results.resolve)} showCounts={false} />
      {/if}
      {#if results.resolve.type_ == 'post'}
        <PostItem post={repos.posts.get(results.resolve)} />
      {/if}
      {#if results.resolve.type_ == 'comment'}
        <CommentItem comment={new CommentModel(results.resolve)} />
      {/if}
      {#if results.resolve.type_ == 'person'}
        <UserItem showCounts={false} user={results.resolve} />
      {/if}
    </div>
  {/if}
  {#snippet label(type: SearchType)}
    {#if params.type == 'all'}
      <a
        href={withParams(page.url, { key: 'type', value: type }).toString()}
        class="hover:underline"
      >
        <EndPlaceholder size="lg" class="text-inherit!" margin="lg">
          {$t(`content.${type}`)}
          {#snippet action()}
            <Icon src={ChevronRight} size="20" mini />
          {/snippet}
        </EndPlaceholder>
      </a>
    {/if}
  {/snippet}
  {#each sections as section}
    {#if results && results[section.key] && results[section.key]?.length > 0}
      <div>
        {@render label(section.type)}
        <!--it looks like svelte's typescript handler doesn't understand this-->
        <CommonList animate={false} items={results[section.key]}>
          {#snippet item(item)}
            {@const Component = section.component}
            <Component {...section.props(item)} />
          {/snippet}
          {#if params.type == 'all'}
            <li class="cursor-pointer">
              <Button
                href={withParams(page.url, { key: 'type', value: section.type }).toString()}
                icon={ChevronRight}
                class="w-full"
                color="none"
              >
                More
              </Button>
            </li>
          {/if}
        </CommonList>
      </div>
    {/if}
  {/each}
{/if}

{#if (params.next != null || params.back != null) && params.type != 'all'}
  <Fixate placement="bottom">
    <Pageination
      cursor={{
        next: params.next,
        back: params.back,
      }}
      hasMore={params.next != null}
      href={(cursor) => `?cursor=${cursor}`}
    />
  </Fixate>
{/if}
