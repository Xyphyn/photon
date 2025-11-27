<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import type {
    GetPosts,
    ListingType,
    PostView,
    SortType,
  } from '$lib/api/types'
  import { settings } from '$lib/app/settings.svelte'
  import Location from '$lib/feature/filter/Location.svelte'
  import Sort from '$lib/feature/filter/Sort.svelte'
  import ViewSelect from '$lib/feature/filter/ViewSelect.svelte'
  import PostFeed from '$lib/feature/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/feature/post/feed/VirtualFeed.svelte'
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { ArrowRight, Icon } from 'svelte-hero-icons/dist'
  import { Header, Pageination } from '..'

  interface Props {
    posts: PostView[]
    cursor?: string
    params: {
      location?: ListingType
      sort?: SortType
    }
    title?: string
    extended?: Snippet
    getParams: GetPosts
    client: {
      lastSeen?: number
      itemHeights?: (number | null)[]
    }
    header?: boolean
  }

  let {
    params,
    posts = $bindable(),
    cursor = $bindable(),
    title,
    extended: passedExtended,
    getParams,
    client = $bindable(),
    header = true,
  }: Props = $props()

  $effect(() => {
    if (filters.sort) settings.value.defaultSort.sort = filters.sort
  })

  let filters = $state({
    location: params.location,
    sort: params.sort,
  })

  const FeedComponent = $derived(
    settings.value.infiniteScroll &&
      browser &&
      !settings.value.posts.noVirtualize
      ? VirtualFeed
      : PostFeed,
  )
</script>

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  {#if header}
    <Header pageHeader>
      {#if title}
        {title}
      {/if}
      {#snippet extended()}
        {@render passedExtended?.()}
        <form class="" method="get" action={page.url.pathname}>
          <div class="flex flex-row gap-2">
            {#if filters.location}
              <Location name="type" navigate bind:selected={filters.location} />
            {/if}
            {#if filters.sort}
              <Sort
                placement="bottom"
                name="sort"
                navigate
                bind:selected={filters.sort}
              />
            {/if}
            <ViewSelect placement="bottom" />

            <noscript>
              <Button
                class="self-end h-[34px] aspect-square"
                size="custom"
                submit
              >
                <Icon src={ArrowRight} size="16" micro />
              </Button>
            </noscript>
          </div>
        </form>
      {/snippet}
    </Header>
  {/if}

  <FeedComponent
    bind:posts
    bind:lastSeen={() => client.lastSeen ?? 0, (v) => (client.lastSeen = v)}
    bind:params={getParams}
    virtualList={{ itemHeights: client?.itemHeights ?? [] }}
  />
  <svelte:element
    this={settings.value.infiniteScroll && !settings.value.posts.noVirtualize
      ? 'noscript'
      : 'div'}
    class="mt-auto flex flex-col"
  >
    <Pageination
      cursor={{ next: cursor }}
      href={(page) =>
        typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
      back={false}
    />
  </svelte:element>
</div>
