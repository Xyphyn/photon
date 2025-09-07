<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { notifications, profile } from '$lib/auth.svelte.js'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import { Header } from '$lib/components/ui/layout'
  import Pageination from '$lib/components/ui/layout/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/client/lemmy.svelte'
  import { searchParam } from '$lib/util.svelte'
  import { Button, Option, Select } from 'mono-svelte'
  import { ArrowPath, Check, Funnel, Icon, Inbox } from 'svelte-hero-icons'
  import InboxItem from './InboxItem.svelte'
  import Fixate from '$lib/components/ui/generic/Fixate.svelte'

  let { data } = $props()

  let markingAsRead = $state(false)

  async function markAllAsRead() {
    if (!profile.current?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead()

    $notifications.inbox = 0

    goto(page.url, {
      invalidateAll: true,
    }).then(() => {
      markingAsRead = false
    })

    return response.replies
  }
</script>

<svelte:head>
  <title>{$t('routes.inbox.title')}</title>
</svelte:head>

<Header pageHeader class="lg:flex-row justify-between flex-col">
  {$t('routes.inbox.title')}

  <div class="flex items-center gap-2 tracking-normal">
    <Button
      onclick={() => goto(page.url, { invalidateAll: true })}
      size="custom"
      class="rounded-2xl h-9 aspect-square"
      rounding="none"
      aria-label={$t('common.refresh')}
      icon={ArrowPath}
    ></Button>
    <Button
      onclick={markAllAsRead}
      loading={markingAsRead}
      disabled={markingAsRead || data.inbox.value.length == 0}
      rounding="pill"
      color="primary"
      icon={Check}
    >
      {$t('routes.inbox.markAsRead')}
    </Button>
  </div>
</Header>

<Select
  class="relative"
  bind:value={
    () => data.unreadOnly.value.toString(),
    (v) => (data.unreadOnly.value = v == 'true')
  }
  onchange={() =>
    searchParam(
      page.url,
      'unreadOnly',
      data.unreadOnly.value ? 'true' : 'false',
      'page',
    )}
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

<div class="h-3 sm:h-6"></div>

{#if !data.inbox?.value || (data.inbox.value?.length ?? 0) == 0}
  <Placeholder
    icon={Inbox}
    title={$t('routes.inbox.empty.title')}
    description={$t('routes.inbox.empty.description')}
    class="self-center justify-self-center my-auto"
  />
{:else}
  <CommonList items={data.inbox.value} size="md">
    {#snippet item(item)}
      <InboxItem {item} />
    {/snippet}
  </CommonList>
{/if}
{#if !(data.page == 1 && (data?.inbox?.value.length ?? 0) == 0)}
  <Fixate placement="bottom">
    <Pageination
      hasMore={!(
        !data.inbox || (data.inbox.value?.length ?? 0) < (data?.limit ?? 0)
      )}
      page={data.page}
      href={(page) => `?page=${page}`}
    />
  </Fixate>
{/if}
