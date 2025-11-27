<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { getClient } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { Button, Option, Select } from 'mono-svelte'
  import { ArrowPath, Check, Funnel, Icon, Inbox } from 'svelte-hero-icons/dist'
  import InboxItem from './InboxItem.svelte'

  let { data } = $props()

  let markingAsRead = $state(false)

  async function markAllAsRead() {
    if (!profile.current?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead()

    profile.inbox.notifications.inbox = 0

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

  {#snippet extended()}
    <div class="flex gap-2 tracking-normal items-end">
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
      <div class="flex-1"></div>
      <Button
        onclick={markAllAsRead}
        loading={markingAsRead}
        disabled={markingAsRead || data.inbox.value.length == 0}
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

{#if !data.inbox?.value || (data.inbox.value?.length ?? 0) == 0}
  <Placeholder
    icon={Inbox}
    title={$t('routes.inbox.empty.title')}
    description={$t('routes.inbox.empty.description')}
    class="self-center justify-self-center my-auto"
  />
{:else}
  <CommonList size="md">
    {#each data.inbox.value as item}
      <li
        class={[
          'lg:px-2.5 lg:py-1.5',
          !item.read && 'bg-blue-300/10! dark:bg-blue-500/5!',
        ]}
      >
        <InboxItem {item} />
      </li>
    {/each}
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
