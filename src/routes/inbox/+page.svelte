<script lang="ts">
  import InboxItem from './InboxItem.svelte'
  import {
    AdjustmentsHorizontal,
    ArrowPath,
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
  import { notifications, profile } from '$lib/auth.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { fly } from 'svelte/transition'
  import { searchParam } from '$lib/util.js'
  import { Button, Select } from 'mono-svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { t } from '$lib/translations'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { contentPadding } from '$lib/components/ui/layout/Shell.svelte'

  export let data

  let markingAsRead = false

  async function markAllAsRead() {
    if (!$profile?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead()

    $notifications.inbox = 0

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

<div class="flex flex-row gap-2">
  <Header pageHeader class="sm:flex-row flex-col justify-between items-end">
    {$t('routes.inbox.title')}

    <div class="flex items-center gap-2">
      <Button
        on:click={() => goto($page.url, { invalidateAll: true })}
        size="square-md"
        title={$t('common.refresh')}
      >
        <Icon src={ArrowPath} size="16" mini slot="prefix" />
      </Button>
      <Button
        on:click={markAllAsRead}
        loading={markingAsRead}
        disabled={markingAsRead}
        size="md"
        class="h-8"
      >
        <Icon src={Check} width={16} mini slot="prefix" />
        {$t('routes.inbox.markAsRead')}
      </Button>
    </div>
  </Header>
</div>
<div class="mt-4" />

<div
  class="mt-4 mb-0 sticky z-30 mx-auto max-w-full"
  style="top: max(1.5rem, {$contentPadding.top}px);"
>
  <Tabs
    routes={[
      {
        href: '/inbox',
        name: $t('filter.location.all'),
      },
      {
        href: '/inbox?type=Replies',
        name: $t('filter.inbox.replies'),
      },
      {
        href: '/inbox?type=Mentions',
        name: $t('filter.inbox.mentions'),
      },
      {
        href: '/inbox/messages',
        name: $t('filter.inbox.messages'),
      },
    ]}
    currentRoute="{$page.url.pathname}{$page.url.search}"
    class="overflow-auto"
  />
</div>
<div class="flex flex-row gap-4 flex-wrap items-end">
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
      {$t('filter.filter')}
    </span>
    <option value="false">{$t('filter.location.all')}</option>
    <option value="true">{$t('filter.unread')}</option>
  </Select>
</div>
<div class="flex flex-col gap-4 list-none flex-1 h-full mt-4">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <Placeholder
      icon={Inbox}
      title={$t('routes.inbox.empty.title')}
      description={$t('routes.inbox.empty.description')}
    />
  {:else}
    {#each data.data as item}
      <div in:fly={{ duration: 500, y: -6, opacity: 0 }}>
        <InboxItem {item} />
      </div>
    {/each}
  {/if}
  {#if !(data.page == 1 && (data?.data?.length ?? 0) == 0)}
    <div
      class="sticky z-30 mx-auto max-w-full self-end mt-auto"
      style="bottom: max(1.5rem, {$contentPadding.bottom}px);"
    >
      <Tabs routes={[]} class="mx-auto">
        <Pageination
          hasMore={!(!data.data || (data.data?.length ?? 0) < data.limit)}
          page={data.page}
          on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
        />
      </Tabs>
    </div>
  {/if}
</div>
