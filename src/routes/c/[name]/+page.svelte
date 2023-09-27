<script lang="ts">
  import { navigating, page } from '$app/stores'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'
  import { fullCommunityName, searchParam } from '$lib/util.js'
  import { onDestroy, onMount } from 'svelte'
  import { setSessionStorage } from '$lib/session.js'
  import PostFeed from '$lib/components/lemmy/post/PostFeed.svelte'
  import { Button, Modal, toast } from 'mono-svelte'
  import { afterNavigate } from '$app/navigation'
  import { browser } from '$app/environment'

  export let data

  let sidebar: boolean = false

  onMount(() => {
    if (browser)
      setSessionStorage('lastSeenCommunity', {
        id: data.community.community_view.community.id,
        name: fullCommunityName(
          data.community.community_view.community.name,
          data.community.community_view.community.actor_id
        ),
      })
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

<div class="flex flex-col md:flex-row gap-4 w-full">
  <div class="flex flex-col gap-3 sm:gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-3 items-center">
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
          class="dark:text-zinc-400 text-slate-600 text-sm"
        >
          !{data.community.community_view.community.name}@{new URL(
            data.community.community_view.community.actor_id
          ).hostname}
        </button>
      </div>
    </div>
    <div class="flex flex-row gap-4 max-w-full w-full items-end">
      <Sort selected={data.sort} />
      <div class="xl:hidden">
        <Button color="secondary" on:click={() => (sidebar = !sidebar)}>
          About
        </Button>
      </div>
    </div>
    <PostFeed community={true} posts={data.posts.posts} />

    <Pageination
      page={data.page}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    >
      {#if data.posts.posts.length > 0}
        <span class="max-sm:hidden">
          You've scrolled <span class="text-primary-900 dark:text-primary-100">
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
      {/if}
    </Pageination>
  </div>
  <div class="hidden xl:block">
    <CommunityCard
      community_view={data.community.community_view}
      moderators={data.community.moderators}
    />
  </div>
</div>
