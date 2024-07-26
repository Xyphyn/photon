<script lang="ts" context="module">
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { searchParam } from '$lib/util.js'
  import { ChartBar, ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import { getClient, site } from '$lib/lemmy.js'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations.js'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import { Button } from 'mono-svelte'
  import { writable } from 'svelte/store'
  import type { GetPostsResponse, ListingType, SortType } from 'lemmy-js-client'
  import { userSettings } from '$lib/settings.js'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import { postFeeds, getPostFeed } from '$lib/lemmy/postfeed.js'

  export let data
</script>

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <header class="flex flex-col gap-4 relative">
    <Header>
      {$t('routes.frontpage.title')}

      <div class="flex items-center gap-2" slot="extended">
        {#if data.type_}
          <Location changeDefault selected={data.type_} />
        {/if}
        <Sort changeDefault selected={data.sort} />
        <ViewSelect />
      </div>
    </Header>
  </header>

  <svelte:component
    this={browser ? VirtualFeed : PostFeed}
    posts={data.posts.posts}
    bind:feedData={data}
    feedId="main"
  />
  <svelte:element
    this={$userSettings.infiniteScroll ? 'noscript' : 'div'}
    class="mt-auto"
  >
    <Pageination
      cursor={{ next: data.cursor.next }}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      on:cursor={(c) => {
        searchParam($page.url, 'cursor', c.detail)
      }}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        {$t('routes.frontpage.footer', {
          // @ts-ignore
          users: $site?.site_view.counts.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </svelte:element>
</div>
