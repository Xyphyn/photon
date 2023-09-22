<script lang="ts">
  import { page } from '$app/stores'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { searchParam } from '$lib/util.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { Button, Modal, Select, Spinner } from 'mono-svelte'
  import { GlobeAmericas, Icon } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import ViewSelect from '$lib/components/lemmy/ViewSelect.svelte'
  import { site } from '$lib/lemmy.js'

  export let data

  let sidebar = false
</script>

<svelte:head>
  <title>Photon</title>
</svelte:head>

<Modal bind:open={sidebar}>
  <span slot="title">About</span>
  <div class="mx-auto">
    {#if $site}
      <SiteCard
        site={$site.site_view}
        taglines={$site.taglines}
        admins={$site.admins}
      />
    {/if}
  </div>
</Modal>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <header>
      <h1
        class="text-3xl font-bold flex items-center w-full justify-between flex-wrap"
      >
        Frontpage
        <span class="xl:hidden">
          <Button on:click={() => (sidebar = !sidebar)}>About</Button>
        </span>
      </h1>
    </header>
    <div
      class="flex flex-row gap-4 max-w-full justify-between w-full flex-wrap"
    >
      <Select
        bind:value={data.listingType}
        on:change={() =>
          searchParam($page.url, 'type', data.listingType, 'page')}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={GlobeAmericas} size="16" mini />
          Location
        </span>
        <option value="All">All</option>
        <option value="Local">Local</option>
        <option value="Subscribed" disabled={!$profile?.jwt}>Subscribed</option>
      </Select>
      <div class="flex gap-4 flex-wrap">
        <Sort selected={data.sort} />
        <div class="max-[420px]:hidden">
          <ViewSelect />
        </div>
      </div>
    </div>
    <section class="flex flex-col gap-3 sm:gap-4 h-full">
      <PostFeed posts={data.posts.posts} />
    </section>
    <div class="mt-auto">
      <Pageination
        page={data.page}
        on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      >
        <span class="max-sm:hidden">
          You've viewed <span
            class="text-primary-900 dark:text-primary-100 font-bold"
          >
            {data.page * 20}
          </span>
          posts.
        </span>
        <span class="sm:hidden">
          <span class="text-primary-900 dark:text-primary-100">
            {data.page * 20}
          </span>
          posts
        </span>
      </Pageination>
    </div>
  </div>
  <div class="hidden xl:block">
    {#if !$site}
      <StickyCard>
        <div class="h-64 grid place-items-center">
          <Spinner width={32} />
        </div>
      </StickyCard>
    {:else}
      <SiteCard
        site={$site.site_view}
        taglines={$site.taglines}
        admins={$site.admins}
      />
    {/if}
  </div>
</div>
