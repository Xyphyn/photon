<script lang="ts">
  import { browser } from '$app/environment'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { site } from '$lib/client/client.svelte.js'
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

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  <header class="flex flex-col gap-4 relative">
    <Header pageHeader>
      {$t('routes.frontpage.title')}

      {#snippet extended()}
        <form class="flex items-center gap-2" method="get" action="/">
          {#if type}
            <Location name="type" navigate bind:selected={type} />
          {/if}
          <Sort name="sort" navigate bind:selected={sort} />
          <ViewSelect />

          <noscript>
            <Button
              class="self-end h-[34px] aspect-square"
              size="custom"
              submit
            >
              <Icon src={ArrowRight} size="16" micro />
            </Button>
          </noscript>
        </form>
      {/snippet}
    </Header>
  </header>

  <FeedComponent
    bind:posts={data.feed.value.posts.posts}
    bind:feedData={data.feed.value}
    feedId="main"
  />
  <svelte:element
    this={settings.infiniteScroll && !settings.posts.noVirtualize
      ? 'noscript'
      : 'div'}
    class="mt-auto"
  >
    <Pageination
      cursor={{ next: data.feed.value.cursor.next }}
      href={page =>
        typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
      back={false}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        {$t('routes.frontpage.footer', {
          users: site.data?.site_view?.counts?.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </svelte:element>
</div>
