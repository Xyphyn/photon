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
  <Header class="justify-between items-end">
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
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'all', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={AdjustmentsHorizontal} size="15" mini />
      {$t('filter.type')}
    </span>
    <option value="all">{$t('filter.location.all')}</option>
    <option value="mentions">{$t('filter.inbox.mentions')}</option>
    <option value="replies">{$t('filter.inbox.replies')}</option>
    <option value="messages">{$t('filter.inbox.messages')}</option>
  </Select>
</div>
<div class="flex flex-col gap-4 list-none flex-1 h-full justify-center mt-4">
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
    <div class="ml-auto mt-auto">
      <Pageination
        page={data.page}
        on:change={(p) => searchParam($page.url, 'page', p.detail.toString())}
      />
    </div>
  {/if}
</div>
