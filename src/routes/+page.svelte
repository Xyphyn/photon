<script lang="ts">
  import { browser } from '$app/environment'
  import { site } from '$lib/client/lemmy.svelte'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Skeleton from '$lib/components/ui/generic/Skeleton.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/layout/Pageination.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { postFeeds } from '$lib/lemmy/postfeed.svelte.js'
  import { settings, SSR_ENABLED } from '$lib/settings.svelte.js'
  import Button from 'mono-svelte/button/Button.svelte'
  import { ArrowRight, ChartBar, Icon } from 'svelte-hero-icons'

  let { data = $bindable() } = $props()

  $effect(() => {
    if (data.filters.value.type_)
      settings.defaultSort.feed = data.filters.value.type_
    if (data.filters.value.sort)
      settings.defaultSort.sort = data.filters.value.sort
  })

  const FeedComponent = $derived(
    settings.infiniteScroll && browser && !settings.posts.noVirtualize
      ? VirtualFeed
      : PostFeed,
  )
</script>

<svelte:head>
  <title>
    {SSR_ENABLED && site.data
      ? site.data.site_view.site.name
      : $t('routes.frontpage.title')}
  </title>
</svelte:head>

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  <Header pageHeader>
    {$t('routes.frontpage.title')}

    {#snippet extended()}
      <form class="" method="get" action="/">
        <div class="flex flex-row gap-2">
          {#if data.filters.value.type_}
            <Location
              name="type"
              navigate
              bind:selected={data.filters.value.type_}
            />
          {/if}
          <Sort
            placement="bottom"
            name="sort"
            navigate
            bind:selected={data.filters.value.sort}
          />
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

  {#await data.feed.value}
    {#each new Array(5) as _, index}{_}
      <div
        class="animate-pop-in"
        style="animation-delay: {index * 50}ms; opacity: 0; width: {(1 /
          ((index + 1) % 3)) *
          100}%"
      >
        <Skeleton />
      </div>{/each}
  {:then feed}
    <FeedComponent
      bind:posts={feed.posts.posts}
      bind:feedData={() => feed, (v) => (postFeeds.value.main.data = v)}
      feedId="main"
    />
    <svelte:element
      this={settings.infiniteScroll && !settings.posts.noVirtualize
        ? 'noscript'
        : 'div'}
      class="mt-auto flex flex-col"
    >
      <EndPlaceholder>
        <Icon src={ChartBar} size="16" mini />

        {$t('routes.frontpage.footer', {
          users: site.data?.site_view?.counts?.users_active_day ?? '??',
        })}
        {#snippet action()}
          <Pageination
            cursor={{ next: feed.cursor.next }}
            href={(page) =>
              typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
            back={false}
          />
        {/snippet}
      </EndPlaceholder>
    </svelte:element>
  {/await}
</div>
