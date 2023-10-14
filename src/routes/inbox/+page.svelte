<script lang="ts">
  import InboxItem from './InboxItem.svelte'
  import {
    AdjustmentsHorizontal,
    Bars3BottomRight,
    Check,
    Funnel,
    Icon,
    Inbox,
  } from 'svelte-hero-icons'
  import { getClient } from '$lib/lemmy.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { profile } from '$lib/auth.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { fly } from 'svelte/transition'
  import { searchParam } from '$lib/util.js'
  import { Button, Select } from 'mono-svelte'

  export let data

  let markingAsRead = false

  async function markAllAsRead() {
    if (!$profile?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead()

    $profile.user.notifications.inbox = 0

    goto($page.url, {
      invalidateAll: true,
    }).then(() => {
      markingAsRead = false
    })

    return response.replies
  }
</script>

<svelte:head>
  <title>Inbox</title>
</svelte:head>

<div class="flex flex-row justify-between">
  <h1 class="font-bold text-3xl">Inbox</h1>
  <Button
    on:click={markAllAsRead}
    loading={markingAsRead}
    disabled={markingAsRead}
    size="md"
  >
    <Icon src={Check} width={16} mini slot="prefix" />
    Mark all as read
  </Button>
</div>
<div class="mt-4" />
<div class="flex flex-row gap-4 flex-wrap">
  <Select
    bind:value={data.unreadOnly}
    on:change={() =>
      searchParam(
        $page.url,
        'unreadOnly',
        data.unreadOnly?.toString() ?? 'false',
        'page'
      )}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={Funnel} size="15" mini />
      Filter
    </span>
    <option value="false">All</option>
    <option value="true">Unread</option>
  </Select>
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'all', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={AdjustmentsHorizontal} size="15" mini />
      Type
    </span>
    <option value="all">All</option>
    <option value="mentions">Mentions</option>
    <option value="replies">Replies</option>
    <option value="messages">Messages</option>
  </Select>
</div>
<div class="flex flex-col gap-4 list-none my-4 flex-1 h-full">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <Placeholder
      icon={Inbox}
      title="No new notifications"
      description="Messages, replies, and mentions will appear here."
    />
  {:else}
    {#each data.data as item}
      <div in:fly={{ duration: 500, y: -6, opacity: 0 }}>
        <InboxItem {item} />
      </div>
    {/each}
    <Pageination
      page={data.page}
      on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
    />
  {/if}
</div>
