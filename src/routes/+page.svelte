<script lang="ts">
  import { page } from "$app/stores";
  import SiteCard from "$lib/components/lemmy/SiteCard.svelte";
  import Pageination from "$lib/components/ui/Pageination.svelte";
  import Sort from "$lib/components/lemmy/Sort.svelte";
  import { searchParam } from "$lib/util.js";
  import PostFeed from "$lib/components/lemmy/post/PostFeed.svelte";
  import { Button, Modal, Select, Spinner } from "mono-svelte";
  import { ChartBar, GlobeAmericas, Icon, ServerStack } from "svelte-hero-icons";
  import { profile } from "$lib/auth.js";
  import ViewSelect from "$lib/components/lemmy/ViewSelect.svelte";
  import { site } from "$lib/lemmy.js";
  import { amModOfAny } from "$lib/components/lemmy/moderation/moderation.js";
  import { feature } from "$lib/version.js";

  export let data;

  let sidebar = false;
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
        version={$site.version}
      />
    {/if}
  </div>
</Modal>

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <header>
    <h1
      class="text-3xl font-bold flex items-center w-full justify-between flex-wrap"
    >
      Frontpage
      <span class="xl:hidden">
        <Button on:click={() => (sidebar = !sidebar)} size="square-md">
          <Icon src={ServerStack} size="16" mini />
        </Button>
      </span>
    </h1>
  </header>
  <div class="flex flex-row gap-4 max-w-full justify-between w-full flex-wrap">
    <Select
      bind:value={data.listingType}
      on:change={() =>
        searchParam($page.url, "type", data.listingType, "page", "cursor")}
    >
      <span slot="label" class="flex items-center gap-1">
        <Icon src={GlobeAmericas} size="16" mini />
        Location
      </span>
      <option value="All">All</option>
      <option value="Local">Local</option>
      <option value="Subscribed" disabled={!$profile?.jwt}>Subscribed</option>
      {#if feature("moderatorView", $site?.version)}
        <option
          value="ModeratorView"
          disabled={!$profile?.jwt || !amModOfAny($profile?.user)}
        >
          Moderator
        </option>
      {/if}
    </Select>
    <div class="flex gap-4 flex-wrap">
      <Sort selected={data.sort} />
      <div class="max-[420px]:hidden">
        <ViewSelect />
      </div>
    </div>
  </div>
  <PostFeed
    initialPosts={data.posts.posts}
    cursor={{ next: data.cursor.next, back: data.cursor.back }}
  />
  <div class="mt-auto">
    <Pageination
      page={data.page}
      cursor={{ next: data.cursor.next, back: data.cursor.back }}
      on:change={(p) => searchParam($page.url, "page", p.detail.toString())}
      on:cursor={(c) => {
        searchParam($page.url, "cursor", c.detail);
      }}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        <span class="font-medium text-black dark:text-white">
          {$site?.site_view.counts.users_active_day}
        </span>
        <span class="font-normal">Active users</span>
      </span>
    </Pageination>
  </div>
</div>
