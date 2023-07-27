<script lang="ts">
  import InboxItem from './InboxItem.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { Check, Icon } from 'svelte-hero-icons'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { isRead } from '$lib/lemmy/inbox.js'
  import Pageination from '$lib/components/ui/Pageination.svelte'

  export let data

  let markingAsRead = false

  async function markAllAsRead() {
    if (!$user) {
      goto('/login')
      return
    }

    markingAsRead = true

    const response = await getClient().markAllAsRead({
      auth: $authData!.token,
    })

    $user!.unreads = 0

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
<div class="flex flex-col gap-4 list-none my-4">
  {#if !data.data || (data.data?.length ?? 0) == 0}
    <p class="text-center opacity-60 text-lg mx-4">
      Wow, it's quite empty in here.
    </p>
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
