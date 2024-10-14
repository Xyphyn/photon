<script lang="ts" context="module">
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { searchParam } from '$lib/util.js'
  import { ChartBar, Icon } from 'svelte-hero-icons'
  import { site } from '$lib/lemmy.js'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations.js'
  import { userSettings } from '$lib/settings.js'
  import { browser } from '$app/environment'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'

  export let data
</script>

<div class="flex flex-col gap-2 max-w-full w-full min-w-0">
  <header class="flex flex-col gap-4 relative">
    <Header pageHeader>
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
    this={$userSettings.infiniteScroll &&
    browser &&
    !$userSettings.posts.noVirtualize
      ? VirtualFeed
      : PostFeed}
    posts={data.posts.posts}
    bind:feedData={data}
    feedId="main"
  />
  <svelte:element
    this={$userSettings.infiniteScroll && !$userSettings.posts.noVirtualize
      ? 'noscript'
      : 'div'}
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
          users: $site?.site_view?.counts?.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </svelte:element>
</div>
