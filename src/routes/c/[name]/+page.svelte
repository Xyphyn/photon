<script lang="ts">
  import { navigating, page } from '$app/stores'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import { fullCommunityName, searchParam } from '$lib/util.js'
  import { onDestroy, onMount } from 'svelte'
  import { setSessionStorage } from '$lib/session.js'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'
  import {
    ArrowRight,
    ChartBar,
    Check,
    Cog6Tooth,
    EllipsisHorizontal,
    Icon,
    InformationCircle,
    Plus,
    XMark,
  } from 'svelte-hero-icons'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { profile } from '$lib/auth'
  import { t } from '$lib/translations.js'
  import { userSettings } from '$lib/settings.js'
  import { site } from '$lib/lemmy.js'
  import { postFeeds } from '$lib/lemmy/postfeed.js'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Subscribe from '../../communities/Subscribe.svelte'
  import { resumables } from '$lib/lemmy/item'
  import CommunityHeader from '$lib/components/lemmy/community/CommunityHeader.svelte'

  export let data

  $: community = data.community.community_view

  let sidebar: boolean = false

  onMount(() => {
    if (browser)
      setSessionStorage(
        'lastSeenCommunity',
        data.community.community_view.community
      )

    resumables.add({
      name: community.community.title,
      type: 'community',
      url: $page.url.toString(),
      avatar: community.community.icon,
    })
  })

  onDestroy(() => {
    if (browser) {
      if ($navigating?.to?.route?.id == '/create/post') return

      setSessionStorage('lastSeenCommunity', undefined)
    }
  })
</script>

{#if sidebar}
  <Modal bind:open={sidebar}>
    <span slot="title">About</span>
    <div>
      <CommunityCard
        bind:community_view={community}
        moderators={data.community.moderators}
      />
    </div>
  </Modal>
{/if}

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <CommunityHeader
    bind:community={community.community}
    bind:subscribed={community.subscribed}
    bind:blocked={community.blocked}
    moderators={data.community.moderators}
    counts={community.counts}
  />
  <Sort selected={data.sort} />
  {#if community.blocked}
    <Placeholder
      icon={XMark}
      title="Blocked"
      description="You've blocked this community."
    >
      <Button href="/profile/blocks">
        <Icon src={ArrowRight} size="16" mini slot="suffix" />
        Blocked Communities
      </Button>
    </Placeholder>
  {:else}
    <svelte:component
      this={browser ? VirtualFeed : PostFeed}
      posts={data.posts.posts}
      bind:feedData={data}
      feedId="community"
      community
    />
  {/if}

  <svelte:element
    this={$userSettings.infiniteScroll ? 'noscript' : 'div'}
    class="mt-auto"
  >
    <Pageination
      page={data.page}
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

<style>
</style>
