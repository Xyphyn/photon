<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { t } from '$lib/i18n/translations.js'
  import type { Person, PrivateMessageView } from 'lemmy-js-client'
  import { Spinner } from 'mono-svelte'
  import { backOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  interface ConversationPreview {
    user: Person
    message: {
      date: Date
      last_sender: string
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
          last_sender: i.creator.name,
          content: i.private_message.content,
        },
      }))
  }

  let { data } = $props()
</script>

<Header pageHeader>
  {$t('filter.inbox.messages')}
</Header>
{#await data.messages}
  <div class="w-full h-full grid place-items-center">
    <Spinner width={24} />
  </div>
{:then data}
  {@const conversations = data.private_messages}
  {@const previews = conversationPreviews(conversations)}

  <ul
    class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800 w-full mt-6"
  >
    {#each previews as preview, index (preview)}
      <a
        href="/inbox/messages/{preview.user.id}"
        class="flex flex-row gap-2 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 w-full min-w-0
        hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
        in:fly|global={{
          duration: 700,
          easing: backOut,
          y: 12,
          delay: index * 100,
        }}
      >
        <Avatar url={preview.user.avatar} alt={preview.user.name} width={32} />
        <div class="flex flex-col w-full overflow-hidden">
          <div class="font-medium">{preview.user.name}</div>
          <div
            class="text-sm text-ellipsis whitespace-nowrap
            bg-linear-to-r from-slate-700 via-slate-700 to-slate-700/0 dark:from-zinc-300 dark:via-zinc-300 dark:to-zinc-300/0
            text-transparent bg-clip-text"
          >
            {preview.message.last_sender}: {preview.message.content}
          </div>
        </div>
      </a>
    {/each}
  </ul>
{/await}
