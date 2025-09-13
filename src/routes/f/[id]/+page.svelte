<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import ItemList from '$lib/components/lemmy/generic/ItemList.svelte'
  import { PostFeed, VirtualFeed } from '$lib/components/lemmy/post'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import { Header } from '$lib/components/ui/layout'
  import Pageination from '$lib/components/ui/layout/Pageination.svelte'
  import { t } from '$lib/i18n/translations.js'
  import type { FeedTypes } from '$lib/lemmy/feeds/feed.svelte.js'
  import { settings } from '$lib/settings.svelte.js'
  import { communityLink } from '$lib/util.svelte.js'
  import { Spinner } from 'mono-svelte'
  import Button from 'mono-svelte/button/Button.svelte'
  import { ArrowRight, Icon } from 'svelte-hero-icons'
  import { SvelteURL } from 'svelte/reactivity'

  interface Props {
    data: FeedTypes['/f/[id]'][1]
  }

  let { data = $bindable() }: Props = $props()

  $effect(() => {
    if (data.params.sort) settings.defaultSort.sort = data.params.sort
  })

  const FeedComponent = $derived(
    settings.infiniteScroll && browser && !settings.posts.noVirtualize
      ? VirtualFeed
      : PostFeed,
  )

  let title = $state('Loading...')
  data.feed.then((i) => (title = i?.title ?? ''))
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  <Header pageHeader>
    {#snippet extended()}
      <div class="min-h-56 grid place-items-center">
        {#await data.feed}
          <Spinner width={32} />
        {:then feed}
          {#if feed}
            <EntityHeader
              class="w-full relative flex flex-col"
              compact="always"
              avatarCircle={false}
              name={feed.title}
              avatar={feed.icon}
            >
              {#snippet nameDetail()}
                <p class="text-lg">{feed.name}</p>
              {/snippet}
              {#if feed.communities}
                <Expandable>
                  {#snippet title()}
                    {$t('content.communities')}
                  {/snippet}
                  <ItemList
                    items={feed.communities.map((i) => ({
                      id: i.id,
                      name: i.title,
                      url: communityLink(i),
                      avatar: i.icon,
                      instance: new SvelteURL(i.actor_id).hostname,
                    }))}
                  />
                </Expandable>
              {/if}
            </EntityHeader>
          {/if}
        {/await}
      </div>
      <form class="" method="get" action={page.url.pathname}>
        <div class="flex flex-row gap-2">
          <Sort
            placement="bottom"
            name="sort"
            navigate
            bind:selected={data.params.sort!}
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

  <FeedComponent
    bind:posts={data.posts}
    bind:lastSeen={
      () => data.client.lastSeen ?? 0, (v) => (data.client.lastSeen = v)
    }
    bind:params={data.params}
    virtualList={{ itemHeights: data.client?.itemHeights ?? [] }}
  />
  <svelte:element
    this={settings.infiniteScroll && !settings.posts.noVirtualize
      ? 'noscript'
      : 'div'}
    class="mt-auto flex flex-col"
  >
    <Pageination
      cursor={{ next: data.next_page }}
      href={(page) =>
        typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
      back={false}
    />
  </svelte:element>
</div>
