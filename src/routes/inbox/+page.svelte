<script lang="ts">
  import InboxItem from './InboxItem.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { Check, EnvelopeOpen, Icon } from 'svelte-hero-icons'
  import { getClient } from '$lib/lemmy.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { isRead } from '$lib/lemmy/inbox.js'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { profile } from '$lib/auth.js'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'

  export let data

  let markingAsRead = false

  async function markAllAsRead() {
    if (!$profile?.user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead({
      auth: $profile.jwt!,
    })

    $profile.user.unreads = 0

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
    <Icon src={Check} width={16} mini slot="icon" />
    Mark all as read
  </Button>
</div>
<div class="mt-4" />
<div class="flex flex-row gap-4 flex-wrap">
  <MultiSelect
    selected={data.unreadOnly}
    options={[false, true]}
    optionNames={['All', 'Unread']}
    on:select={(e) => {
      $page.url.searchParams.delete('page')
      $page.url.searchParams.set('unreadOnly', (e.detail ?? false).toString())
      goto($page.url.toString(), {
        invalidateAll: true,
      })
    }}
  />
  <MultiSelect
    selected={data.type}
    options={['all', 'mentions', 'replies', 'messages']}
    optionNames={['All', 'Mentions', 'Replies', 'Messages']}
    on:select={(e) => {
      $page.url.searchParams.delete('page')
      $page.url.searchParams.set('type', e.detail ?? 'all')
      goto($page.url.toString(), {
        invalidateAll: true,
      })
    }}
  />
</div>
<div class="flex flex-col gap-4 list-none my-4">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <div>
      <Placeholder>
        <Icon src={EnvelopeOpen} size="48" slot="icon" />
        <span slot="title">Inbox empty</span>
        <span slot="description">You're all caught up!</span>
      </Placeholder>
    </div>
  {:else}
    {#each data.data as item}
      <InboxItem {item} read={isRead(item)} />
    {/each}
    <Pageination
      page={data.page}
      on:change={(p) => {
        $page.url.searchParams.set('page', p.detail.toString())
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
  {/if}
</div>
