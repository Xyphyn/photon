<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolveRoute } from '$app/paths'
  import { profile } from '$lib/auth.svelte.js'
  import UserAutocomplete from '$lib/components/lemmy/user/UserAutocomplete.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Skeleton from '$lib/components/ui/generic/Skeleton.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations.js'
  import type { Person, PrivateMessageView } from 'lemmy-js-client'
  import { Button, Modal } from 'mono-svelte'
  import { ChatBubbleOvalLeftEllipsis, Icon, Inbox } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  interface ConversationPreview {
    user: Person
    message: {
      date: Date
      last_sender: number
      content: string
    }
  }

  function getOtherPartyId(message: PrivateMessageView): number {
    return message.creator.id == profile.data.user?.local_user_view.person.id
      ? message.recipient.id
      : message.creator.id
  }

  function filterDuplicates<T, K>(array: T[], predicate: (item: T) => K): T[] {
    const seen = new Set()
    return array.filter(element => {
      const value = predicate(element)
      if (seen.has(value)) {
        return false
      } else {
        seen.add(value)
        return true
      }
    })
  }

  function conversationPreviews(
    conversations: PrivateMessageView[],
  ): ConversationPreview[] {
    const deduplicated = filterDuplicates(conversations, i =>
      getOtherPartyId(i),
    )

    return deduplicated
      .filter(c => c.creator.id != c.recipient.id) // you messaged yourself
      .map(i => ({
        user:
          i.creator.id != profile.data.user?.local_user_view.person.id
            ? i.creator
            : i.recipient,
        message: {
          date: publishedToDate(i.private_message.published),
          last_sender: i.creator.id,
          content: i.private_message.content,
        },
      }))
  }

  let searchModal = $state<{ open: boolean; user?: number }>({
    open: false,
    user: undefined,
  })

  let { data } = $props()
</script>

<Modal bind:open={searchModal.open} title={$t('routes.inbox.messages.start')}>
  <UserAutocomplete
    listing_type="All"
    hideOwnUser={true}
    onselect={u =>
      goto(
        resolveRoute('/inbox/messages/[user_id]', { user_id: u.id.toString() }),
      )}
  />
</Modal>

{#snippet startChat()}
  <Button
    color="primary"
    rounding="pill"
    onclick={() => (searchModal.open = !searchModal.open)}
  >
    <Icon src={ChatBubbleOvalLeftEllipsis} size="18" mini />
    {$t('routes.inbox.messages.start')}
  </Button>
{/snippet}

<Header pageHeader extended={startChat}>
  {$t('filter.inbox.messages')}
</Header>
{#await data.messages}
  <div class="w-full h-full flex flex-col gap-2">
    {#each new Array(5) as _, index}
      {_}
      <div
        in:fly|global={{
          duration: 1000,
          easing: expoOut,
          y: 12,
          delay: index * 50,
        }}
      >
        <Skeleton />
      </div>
    {/each}
  </div>
{:then res}
  {@const conversations = res.private_messages}
  {@const previews = conversationPreviews(conversations)}

  <ul
    class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800 w-full mt-6 h-full"
  >
    {#if previews.length == 0}
      <Placeholder
        title={$t('routes.inbox.messages.empty.title')}
        icon={Inbox}
        class="my-auto"
      >
        {@render startChat?.()}
      </Placeholder>
    {/if}
    {#each previews as preview, index (preview)}
      <a
        href="/inbox/messages/{preview.user.id}"
        class="flex flex-row gap-2 py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 min-w-0
        hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
        in:fly|global={{
          duration: 1000,
          easing: expoOut,
          y: 12,
          delay: index * 50,
        }}
      >
        <Avatar url={preview.user.avatar} alt={preview.user.name} width={32} />
        <div class="flex flex-col w-full overflow-hidden">
          <div class="font-medium">{preview.user.name}</div>
          <div class="flex w-full">
            <div
              class="text-sm text-ellipsis whitespace-nowrap
            bg-linear-to-r from-slate-700 via-slate-700 to-slate-700/0 dark:from-zinc-300 dark:via-zinc-300 dark:to-zinc-300/0
            text-transparent bg-clip-text flex-1 overflow-hidden"
            >
              {#if preview.message.last_sender == profile.data.user?.local_user_view.person.id}
                {profile.data.user?.local_user_view.person.name}:
              {/if}
              {preview.message.content}
            </div>
            <RelativeDate
              date={preview.message.date}
              class="inline-block text-xs text-slate-600 dark:text-zinc-400 shrink-0"
            />
          </div>
        </div>
      </a>
    {/each}
  </ul>

  {#if res.private_messages.length == 50 || data.page != 1}
    <div class="mt-auto pb-4">
      <Pageination
        page={data.page}
        hasMore={res.private_messages.length == 50}
        href={current => `/inbox/messages?page=${current}`}
      />
    </div>
  {/if}
{/await}
