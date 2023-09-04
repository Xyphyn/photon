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

  export let data

  let sidebar = false
</script>

<svelte:head>
  <title>Photon</title>
</svelte:head>

<Modal bind:open={sidebar}>
  <span slot="title">About</span>
  <div class="mx-auto">
    {#await data.streamed.site then site}
      <SiteCard site={site.site_view} taglines={site.taglines} />
    {/await}
  </div>
</Modal>

<div class="flex flex-row gap-4 w-full h-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <header>
      <h1 class="text-3xl font-bold">Frontpage</h1>
    </header>
    <div class="xl:hidden">
      <Button on:click={() => (sidebar = !sidebar)}>About</Button>
    </div>
    <div
      class="flex flex-row gap-4 max-w-full justify-between w-full flex-wrap"
    >
      <Select
        bind:value={data.listingType}
        on:change={() =>
          searchParam($page.url, 'type', data.listingType, 'page')}
        class="w-28"
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
        <ViewSelect />
      </div>
    </div>
    <section class="flex flex-col gap-3 sm:gap-4 h-full">
      <PostFeed posts={data.posts.posts} />
    </section>
    <div class="mt-auto">
      <Pageination
        page={data.page}
        on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      />
    </div>
  </div>
  <div class="hidden xl:block">
    {#await data.streamed.site}
      <StickyCard>
        <div class="h-64 grid place-items-center">
          <Spinner width={32} />
        </div>
      </StickyCard>
    {:then site}
      <SiteCard site={site.site_view} taglines={site.taglines} />
    {:catch}
      <StickyCard>
        <h1 class="font-bold text-lg">Failed to load</h1>
      </StickyCard>
    {/await}
  </div>
</div>
