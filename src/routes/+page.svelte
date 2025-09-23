<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import { site } from '$lib/client/lemmy.svelte'
  import Location from '$comp/lemmy/dropdowns/Location.svelte'
  import Sort from '$comp/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$comp/lemmy/dropdowns/ViewSelect.svelte'
  import PostFeed from '$comp/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$comp/lemmy/post/feed/VirtualFeed.svelte'
  import Skeleton from '$comp/ui/generic/Skeleton.svelte'
  import { Header, Pageination } from '$comp/ui/layout'
  import { t } from '$lib/i18n/translations.js'
  import { settings, SSR_ENABLED } from '$lib/settings.svelte.js'
  import { Button } from 'mono-svelte'
  import { ArrowRight, Icon } from 'svelte-hero-icons'

  let { data = $bindable() } = $props()

  $effect(() => {
    if (data.filters.value.sort)
      settings.defaultSort.sort = data.filters.value.sort
    if (data.filters.value.type_)
      settings.defaultSort.feed = data.filters.value.type_
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

<Header pageHeader>
  {$t('routes.frontpage.title')}
  {#snippet extended()}
    <form class="" method="get" action={page.url.pathname}>
      <div class="flex flex-row gap-2">
        <Location
          name="type"
          navigate
          bind:selected={data.filters.value.type_!}
        />
        <Sort
          placement="bottom"
          name="sort"
          navigate
          bind:selected={data.filters.value.sort!}
        />
        <ViewSelect placement="bottom" />

        <noscript>
          <Button class="self-end h-[34px] aspect-square" size="custom" submit>
            <Icon src={ArrowRight} size="16" micro />
          </Button>
        </noscript>
      </div>
    </form>
  {/snippet}
</Header>

{#await data.feed.value}
  <div class="space-y-4">
    {#each new Array(5) as _, index}{_}
      <div
        class="animate-pop-in"
        style="animation-delay: {index * 50}ms; opacity: 0; width: {(1 /
          ((index + 1) % 3)) *
          100}%"
      >
        <Skeleton />
      </div>
    {/each}
  </div>
{:then feed}
  <FeedComponent
    bind:posts={feed.posts}
    bind:lastSeen={
      () => feed.client.lastSeen ?? 0, (v) => (feed.client.lastSeen = v)
    }
    bind:params={feed.params}
    virtualList={{ itemHeights: feed.client?.itemHeights ?? [] }}
  />
  <svelte:element
    this={settings.infiniteScroll && !settings.posts.noVirtualize
      ? 'noscript'
      : 'div'}
    class="mt-auto flex flex-col"
  >
    <Pageination
      cursor={{ next: feed.next_page }}
      href={(page) =>
        typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
      back={false}
    />
  </svelte:element>
{/await}
