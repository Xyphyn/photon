<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { client } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import { InboxItemModel } from '$lib/feature/inbox/inbox-item.svelte.js'
  import InboxItem from '$lib/feature/inbox/InboxItem.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { Button, Option, Select } from 'mono-svelte'
  import { ArrowPath, Check, Funnel, Icon, Inbox } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let inbox = $derived(data.inbox.items)
  let params = $derived(data.params.value)

  let markingAsRead = $state(false)

  async function markAllAsRead() {
    if (!profile.current?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    await client().markAllNotificationsAsRead()

    profile.inbox.notifications.inbox = 0

    goto(page.url, {
      invalidateAll: true,
    }).then(() => {
      markingAsRead = false
    })
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
        loading={markingAsRead}
        disabled={markingAsRead || inbox.length == 0}
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

{#if !inbox || (inbox.length ?? 0) == 0}
  <Placeholder
    icon={Inbox}
    title={$t('routes.inbox.empty.title')}
    description={$t('routes.inbox.empty.description')}
    class="self-center justify-self-center my-auto"
  />
{:else}
  <CommonList size="md">
    {#each inbox as item}
      {@const inboxItem = new InboxItemModel(item)}
      <li class={[!inboxItem.read && 'bg-blue-300/10! dark:bg-blue-500/5!']}>
        <InboxItem item={inboxItem} />
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
