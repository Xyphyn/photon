<script lang="ts">
  import { navigating, page } from '$app/stores'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import { fullCommunityName, searchParam } from '$lib/util.js'
  import { onDestroy, onMount } from 'svelte'
  import { setSessionStorage } from '$lib/session.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'
  import {
    ArrowRight,
    ChartBar,
    Cog6Tooth,
    EllipsisHorizontal,
    Icon,
    XMark,
  } from 'svelte-hero-icons'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { profile } from '$lib/auth'
  import { addResumable } from '$lib/lemmy/item.js'

  export let data

  let sidebar: boolean = false

  onMount(() => {
    if (browser)
      setSessionStorage(
        'lastSeenCommunity',
        data.community.community_view.community
      )
  })

  afterNavigate(() => {
    if ($profile) {
      addResumable({
        avatar: data.community.community_view.community.icon,
        id: data.community.community_view.community.id,
        url: $page.url,
        name: data.community.community_view.community.title,
        type: 'community',
      })
    }
  })

  onDestroy(() => {
    if (browser) {
      if ($navigating?.to?.route?.id == '/create/post') return

      setSessionStorage('lastSeenCommunity', undefined)
    }
  })
</script>

<Modal bind:open={sidebar}>
  <span slot="title">About</span>
  <div class="mx-auto">
    <CommunityCard
      community_view={data.community.community_view}
      moderators={data.community.moderators}
    />
  </div>
</Modal>

{#if data.community.community_view.community.banner}
  <img
    src={data.community.community_view.community.banner}
    class="absolute top-0 right-0 object-cover w-full h-40 banner"
    alt="Community banner"
  />
{/if}
<div class="flex flex-col md:flex-row gap-4 w-full">
  <div class="flex flex-col gap-3 sm:gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-3 items-center z-0">
      <Avatar
        width={48}
        url={data.community.community_view.community.icon}
        alt={data.community.community_view.community.name}
      />
      <div class="flex flex-col gap-0">
        <h1 class="font-bold text-xl">
          {data.community.community_view.community.title}
        </h1>
        <button
          on:click={() => {
            navigator?.clipboard?.writeText?.(
              `!${data.community.community_view.community.name}@${
                new URL(data.community.community_view.community.actor_id)
                  .hostname
              }`
            )

            toast({ content: 'Copied to clipboard.' })
          }}
          class="dark:text-zinc-400 text-slate-600 text-sm text-left"
        >
          !{data.community.community_view.community.name}@{new URL(
            data.community.community_view.community.actor_id
          ).hostname}
        </button>
      </div>
      <div class="flex items-center gap-2 w-max ml-auto">
        {#if $profile?.user && $profile.user.moderates
            .map((c) => c.community.id)
            .includes(data.community.community_view.community.id)}
          <Button
            size="square-md"
            color="secondary"
            href="/c/{fullCommunityName(
              data.community.community_view.community.name,
              data.community.community_view.community.actor_id
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
          <Icon src={EllipsisHorizontal} size="16" mini />
        </Button>
      </div>
    </div>
    <div class="flex flex-row gap-4 max-w-full w-full items-end z-0">
      <Sort selected={data.sort} />
    </div>
    {#if data.community.community_view.blocked}
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
      <PostFeed community={true} posts={data.posts.posts} />
    {/if}

    <Pageination
      page={data.page}
      cursor={{ next: data.posts.next_page }}
      on:cursor={(c) => searchParam($page.url, 'cursor', c.detail)}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    >
      {#if data.posts.posts.length > 0}
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChartBar} size="16" mini />
          <span class="font-medium text-black dark:text-white">
            {data.community.community_view.counts.users_active_day}
          </span>
          <span class="font-normal">
            Active user{data.community.community_view.counts.users_active_day >
            1
              ? 's'
              : ''}
          </span>
        </span>
      {/if}
    </Pageination>
  </div>
</div>

<style>
</style>
