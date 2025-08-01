<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { notifications, profile } from '$lib/auth.svelte.js'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { getClient } from '$lib/lemmy.svelte.js'
  import { Button } from 'mono-svelte'
  import { ArrowPath, Check, Icon, Inbox } from 'svelte-hero-icons'
  import InboxItem from './InboxItem.svelte'
  import { SvelteURLSearchParams } from 'svelte/reactivity'

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

  function addSearchParam(
    currentSearchParams: URLSearchParams,
    newParamString: string,
  ) {
    // Create a new SvelteURLSearchParams object from the current search params
    const updatedParams = new SvelteURLSearchParams(currentSearchParams)

    // Parse the new parameter string
    const newParam = new SvelteURLSearchParams(newParamString)

    // Get the key and value of the new parameter
    const [key, value]: [string, string] = newParam.entries().next().value!

    // Add the new parameter to the updated params
    updatedParams.set(key, value)

    return updatedParams
  }
</script>

<svelte:head>
  <title>{$t('routes.inbox.title')}</title>
</svelte:head>

<div
  class="mt-4 mb-2 z-30 mx-auto max-w-full flex gap-2 md:flex-row flex-col
items-center px-2 w-max top-6 lg:top-22"
>
  <Tabs
    routes={[
      {
        href: '?type=all',
        name: $t('filter.location.all'),
      },
      {
        href: '?type=replies',
        name: $t('filter.inbox.replies'),
      },
      {
        href: '?type=mentions',
        name: $t('filter.inbox.mentions'),
      },
      {
        href: '/inbox/messages',
        name: $t('filter.inbox.messages'),
      },
    ]}
    currentRoute={page.url.search}
    buildUrl={(route, href) =>
      href.includes('?')
        ? '?' + addSearchParam(page.url.searchParams, href).toString()
        : `${href}${page.url.search}`}
    defaultRoute="?type=all"
    class="overflow-auto"
  />
  <Tabs
    routes={[
      {
        href: '?unreadOnly=false',
        name: $t('filter.location.all'),
      },
      {
        href: '?unreadOnly=true',
        name: $t('filter.unread'),
      },
    ]}
    currentRoute={page.url.search}
    buildUrl={(route, href) =>
      '?' + addSearchParam(page.url.searchParams, href).toString()}
    defaultRoute="?unreadOnly=true"
    class="overflow-auto"
  />
</div>
<Header pageHeader class="lg:flex-row justify-between flex-col">
  {$t('routes.inbox.title')}

  <div class="flex items-center gap-2 tracking-normal">
    <Button
      onclick={() => goto(page.url, { invalidateAll: true })}
      size="custom"
      class="rounded-2xl h-9 aspect-square"
      rounding="none"
      aria-label={$t('common.refresh')}
    >
      {#snippet prefix()}
        <Icon src={ArrowPath} size="16" mini />
      {/snippet}
    </Button>
    <Button
      onclick={markAllAsRead}
      loading={markingAsRead}
      disabled={markingAsRead || data.inbox.value.length == 0}
      rounding="pill"
      color="primary"
    >
      {#snippet prefix()}
        <Icon src={Check} width={16} mini />
      {/snippet}
      {$t('routes.inbox.markAsRead')}
    </Button>
  </div>
</Header>

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
  <div
    class="sticky z-30 mx-auto max-w-full self-end mt-auto bottom-22 lg:bottom-6"
  >
    <Tabs routes={[]} class="mx-auto">
      <Pageination
        hasMore={!(
          !data.inbox || (data.inbox.value?.length ?? 0) < (data?.limit ?? 0)
        )}
        page={data.page}
        href={page => `?page=${page}`}
      />
    </Tabs>
  </div>
{/if}
