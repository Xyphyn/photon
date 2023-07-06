<script lang="ts">
  import type { CommentReplyView, PersonMentionView } from 'lemmy-js-client'
  import InboxItem from './InboxItem.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { Check, Icon } from 'svelte-hero-icons'
  import { authData, getClient } from '$lib/lemmy.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  export let data: {
    data: PersonMentionView[] | CommentReplyView[]
  }

  function isRead(item: PersonMentionView | CommentReplyView) {
    console.log('running...')
    if ('person_mention' in item) {
      return (item as PersonMentionView).person_mention.read
    }

    if ('comment_reply' in item) {
      return (item as CommentReplyView).comment_reply.read
    }

    return false
  }

  async function markAllAsRead() {
    const response = await getClient().markAllAsRead({
      auth: $authData!.token,
    })

    goto($page.url, {
      invalidateAll: true,
    })

    return response.replies
  }
</script>

<svelte:head>
  <title>Inbox</title>
</svelte:head>

<div class="flex flex-row justify-between">
  <h1 class="font-bold text-3xl">Inbox</h1>
  <Button on:click={markAllAsRead}>
    <Icon src={Check} width={16} mini />
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
  {/if}
</div>
