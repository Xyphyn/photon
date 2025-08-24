<script lang="ts">
  import { browser } from '$app/environment'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { site } from '$lib/lemmy.svelte.js'
  import { postFeeds } from '$lib/lemmy/postfeed.svelte.js'
  import { settings } from '$lib/settings.svelte.js'
  import Button from 'mono-svelte/button/Button.svelte'
  import { ArrowRight, ChartBar, Icon } from 'svelte-hero-icons'

  let { data = $bindable() } = $props()

  let type = $state(data.feed.value.type_)
  let sort = $state(data.feed.value.sort)

  $effect(() => {
    if (type) settings.defaultSort.feed = type
    if (sort) settings.defaultSort.sort = sort
  })

  const FeedComponent = $derived(
    settings.infiniteScroll && browser && !settings.posts.noVirtualize
      ? VirtualFeed
      : PostFeed,
  )
</script>

<svelte:head>
  <title>{site.data?.site_view.site.name}</title>
</svelte:head>

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  <Header pageHeader>
    {$t('routes.frontpage.title')}

    {#snippet extended()}
      <form class="flex items-center gap-2" method="get" action="/">
        {#if type}
          <Location name="type" navigate bind:selected={type} />
        {/if}
        <Sort placement="bottom" name="sort" navigate bind:selected={sort} />
        <ViewSelect placement="bottom" />

        <noscript>
          <Button class="self-end h-[34px] aspect-square" size="custom" submit>
            <Icon src={ArrowRight} size="16" micro />
          </Button>
        </noscript>
      </form>
    {/snippet}
  </Header>

  <FeedComponent
    bind:posts={data.feed.value.posts.posts}
    bind:feedData={() => data.feed.value, v => (postFeeds.value.main.data = v)}
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
          cursor={{ next: data.feed.value.cursor.next }}
          href={page =>
            typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
          back={false}
        />
      {/snippet}
    </EndPlaceholder>
  </svelte:element>
</div>
