<script lang="ts">
  import { page } from '$app/stores'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { searchParam } from '$lib/util.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { Button, Modal, Select, Spinner } from 'mono-svelte'
  import { ChartBar, GlobeAmericas, Icon, ServerStack } from 'svelte-hero-icons'
  import { profile } from '$lib/auth.js'
  import { site } from '$lib/lemmy.js'
  import { amModOfAny } from '$lib/components/lemmy/moderation/moderation.js'
  import { feature } from '$lib/version.js'
  import { userSettings } from '$lib/settings.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import Location from '$lib/components/lemmy/dropdowns/Location.svelte'

  export let data

  let sidebar = false
</script>

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
  <div class="flex items-center gap-2">
    <Location changeDefault selected={data.listingType} />
    <Sort changeDefault selected={data.sort} />
    <div class="max-[420px]:hidden">
      <ViewSelect />
    </div>
  </div>
  <PostFeed posts={data.posts.posts} />
  <div class="mt-auto">
    <Pageination
      page={data.page}
      cursor={{ next: data.cursor.next, back: data.cursor.back }}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      on:cursor={(c) => {
        searchParam($page.url, 'cursor', c.detail)
      }}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        <FormattedNumber
          number={$site?.site_view.counts.users_active_day ?? 0}
          class="text-black dark:text-white font-medium"
        />
        <span class="font-normal">active users</span>
      </span>
    </Pageination>
  </div>
</div>
