<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import { loader, searchParam } from '$lib/app/util.svelte'
  import { Listing } from '$lib/feature/feeds/listing.svelte.js'
  import { InboxItemModel } from '$lib/feature/inbox/inbox-item.svelte.js'
  import InboxItem from '$lib/feature/inbox/InboxItem.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import type { NotificationType } from 'lemmy-js-client'
  import { Button, Option, Select } from 'mono-svelte'
  import { ArrowPath, Check, Funnel, Icon, Inbox } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let listing = $derived(new Listing(data.inbox.items, (i) => new InboxItemModel(i)))
  let params = $derived(data.params)

  let loading = $state(false)

  const markAllAsRead = () =>
    loader(
      (v) => (loading = v),
      () => client().markAllNotificationsAsRead(),
      () => {
        goto(page.url, {
          invalidateAll: true,
        }).then(() => {
          loading = false
        })
      },
    )

  const unreadColors: Record<NotificationType, string> = {
    mention: 'bg-blue-300/10! dark:bg-blue-300/10!',
    reply: 'bg-blue-300/10! dark:bg-blue-300/5!',
    mod_action: 'bg-green-300/10! dark:bg-green-300/5!',
    private_message: 'bg-blue-300/10! dark:bg-orange-300/5!',
    subscribed: 'bg-yellow-300/10! dark:bg-yellow-300/5!',
  }
</script>

<svelte:head>
  <title>{$t('routes.inbox.title')}</title>
</svelte:head>

<Header pageHeader class="lg:flex-row justify-between flex-col">
  {$t('routes.inbox.title')}

  {#snippet extended()}
    <div class="flex gap-2 tracking-normal items-end">
      <Select
        class="relative"
        bind:value={() => params.unreadOnly.toString(), (v) => (params.unreadOnly = v == 'true')}
        onchange={() =>
          searchParam(page.url, 'unreadOnly', params.unreadOnly ? 'true' : 'false', 'page')}
      >
        {#snippet customLabel()}
          <div class="flex items-center gap-1">
            <Icon src={Funnel} size="15" mini />
            {$t('filter.filter')}
          </div>
        {/snippet}
        <Option value="false">{$t('filter.location.all')}</Option>
        <Option value="true">{$t('filter.unread')}</Option>
      </Select>
      <div class="flex-1"></div>
      <Button
        onclick={markAllAsRead}
        {loading}
        disabled={loading || listing.items.length == 0}
        color="primary"
        icon={Check}
        size="lg"
      >
        {$t('routes.inbox.markAsRead')}
      </Button>
      <Button
        onclick={() => goto(page.url, { invalidateAll: true })}
        size="square-lg"
        aria-label={$t('common.refresh')}
        icon={ArrowPath}
      />
    </div>
  {/snippet}
</Header>

{#if listing.items.length == 0}
  <Placeholder
    icon={Inbox}
    title={$t('routes.inbox.empty.title')}
    description={$t('routes.inbox.empty.description')}
    class="self-center justify-self-center my-auto"
  />
{:else}
  <CommonList size="md">
    {#each listing.items as item}
      <li class={[!item.read && unreadColors[item.notification.kind]]}>
        <InboxItem {item} />
      </li>
    {/each}
  </CommonList>
{/if}

{#if params.next != null || params.prev != null}
  <Fixate placement="bottom">
    <Pageination
      hasMore={params.next != null}
      cursor={{ next: params.next, back: params.prev }}
      href={(cursor) => `?cursor=${cursor}`}
    />
  </Fixate>
{/if}
