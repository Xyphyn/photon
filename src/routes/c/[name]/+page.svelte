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

  export let data

  $: community = data.community.community_view

  let sidebar: boolean = false

  onMount(() => {
    if (browser)
      setSessionStorage(
        'lastSeenCommunity',
        data.community.community_view.community,
      )
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
  <EntityHeader
    banner={community.community.banner}
    avatar={community.community.icon}
    name={community.community.title}
    stats={[
      {
        name: $t('cards.community.members'),
        value: community.counts.subscribers.toString(),
      },
      {
        name: $t('content.posts'),
        value: community.counts.posts.toString(),
      },
      {
        name: $t('cards.community.activeDay'),
        value: community.counts.users_active_day.toString(),
      },
    ]}
  >
    <button
      on:click={() => {
        navigator?.clipboard?.writeText?.(
          fullCommunityName(
            community.community.name,
            community.community.actor_id,
          ),
        )
        toast({ content: $t('toast.copied') })
      }}
      class="text-sm flex gap-0 items-center"
      slot="nameDetail"
    >
      !{fullCommunityName(
        community.community.name,
        community.community.actor_id,
      )}
    </button>
    <div class="flex items-center gap-2" slot="actions">
      {#if $profile?.jwt}
        <Subscribe let:subscribe bind:community let:subscribing>
          <Button
            disabled={subscribing}
            loading={subscribing}
            size="md"
            color={community.subscribed == 'NotSubscribed'
              ? 'primary'
              : 'secondary'}
            on:click={async () => {
              community.subscribed =
                (await subscribe())?.community_view.subscribed ??
                'NotSubscribed'

              if ($page.data.slots?.sidebar?.props.community_view)
                $page.data.slots.sidebar.props.community_view = community
            }}
            class="flex-1 relative z-[inherit]"
          >
            <Icon
              src={community.subscribed != 'NotSubscribed' ? Check : Plus}
              mini
              size="16"
              slot="prefix"
            />
            {community.subscribed == 'Subscribed' ||
            community.subscribed == 'Pending'
              ? $t('cards.community.subscribed')
              : $t('cards.community.subscribe')}
          </Button>
        </Subscribe>
      {/if}

      {#if $profile?.user && $profile.user.moderates
          .map((c) => c.community.id)
          .includes(community.community.id)}
        <Button
          size="square-md"
          color="secondary"
          href="/c/{fullCommunityName(
            community.community.name,
            community.community.actor_id,
          )}/settings"
        >
          <Icon src={Cog6Tooth} size="16" mini />
        </Button>
      {/if}
      <Button
        size="square-md"
        color="secondary"
        on:click={() => (sidebar = !sidebar)}
      >
        <Icon src={InformationCircle} size="16" mini />
      </Button>
    </div>
  </EntityHeader>
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
