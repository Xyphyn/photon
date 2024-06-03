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
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations.js'

  export let data
</script>

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <header>
    <Header>{$t('routes.frontpage.title')}</Header>
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
        {$t('routes.frontpage.footer', {
          users: $site?.site_view.counts.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </div>
</div>

<style>
  .background-gradient {
    background-image: radial-gradient(
        circle at left,
        rgba(162, 1, 114, 0.05) 0%,
        rgba(255, 0, 43, 0) 100%
      ),
      radial-gradient(
        circle at 60% 80%,
        rgba(162, 33, 1, 0.1) 0%,
        rgba(255, 0, 174, 0) 100%
      );
    background-repeat: no-repeat;
    mask-image: linear-gradient(to bottom, rgba(0 0 0 / 100%), transparent);
  }
</style>
