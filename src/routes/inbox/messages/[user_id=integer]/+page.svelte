<script lang="ts">
  import { browser } from '$app/environment'
  import { client } from '$lib/api/client.svelte'
  import type { PrivateMessageResponse } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import MarkdownEditor from '$lib/app/markdown/MarkdownEditor.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { report } from '$lib/feature/moderation/moderation'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import { Header } from '$lib/ui/layout'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Button, Material, TextInput, toast } from 'mono-svelte'
  import { onDestroy, onMount, tick } from 'svelte'
  import {
    ArrowLeft,
    ChevronUp,
    Icon,
    Minus,
    PaperAirplane,
    Plus,
  } from 'svelte-hero-icons/dist'
  import { flip } from 'svelte/animate'
  import { backOut, expoOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import Message from './Message.svelte'

  let { data } = $props()

  let textbox = $state({
    message: '',
    loading: false,
  })

  let chatWindow = $state<HTMLDivElement>()

  async function sendMessage(
    message: string,
  ): Promise<PrivateMessageResponse | undefined> {
    if (message == '') return

    textbox.loading = true

    try {
      const res = await client().createPrivateMessage({
        content: message,
        recipient_id: data.creator.value.person_view.person.id,
      })

      textbox.loading = false

      return res
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }

    textbox.loading = false
  }

  $effect(() => {
    if (browser && data.message.value && chatWindow) {
      tick().then(() =>
        chatWindow?.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: 'smooth',
        }),
      )
    }
  })

  async function deleteMessage(id: number) {
    await client().deletePrivateMessage({
      deleted: true,
      private_message_id: id,
    })

    data.message.value = {
      private_messages: data.message.value.private_messages.toSpliced(
        data.message.value.private_messages.findLastIndex(
          (i) => i.private_message.id == id,
        ),
        1,
      ),
    }
  }

  let interval: number = -1
  let page: number = 1

  async function loadMore(page: number = 1) {
    const res = await client().getPrivateMessages({
      creator_id: Number(data.creator.value.person_view.person.id),
      limit: 50,
      page: page,
    })

    const messageSet = new Set(
      data.message!.value.private_messages.map((i) => i.private_message.id),
    )
    const newMessages = res.private_messages.filter(
      (i) => !messageSet.has(i.private_message.id),
    )

    data.message.value.private_messages.push(...newMessages)
    data.message.value.private_messages.sort(
      (a, b) =>
        publishedToDate(b.private_message.published).getTime() -
        publishedToDate(a.private_message.published).getTime(),
    )

    markRead()
  }

  async function markRead() {
    data.message.value.private_messages
      .filter(
        (i) =>
          !i.private_message.read &&
          i.private_message.creator_id !=
            profile.current.user?.local_user_view.person.id,
      )
      .forEach((i) =>
        client().markPrivateMessageAsRead({
          private_message_id: i.private_message.id,
          read: true,
        }),
      )
  }

  onMount(() => {
    markRead()
    interval = setInterval(loadMore, 10 * 1000) as unknown as number

    return () => clearInterval(interval)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<svelte:head>
  <title>
    {$t('routes.inbox.messages.indicator', {
      user: data.creator.value.person_view.person.name,
    })}
  </title>
</svelte:head>

<Header pageHeader>
  {$t('filter.inbox.messages')}
  {#snippet extended()}
    <div class="flex flex-wrap gap-4">
      <Button
        size="square-md"
        href="."
        title={$t('common.back')}
        icon={ArrowLeft}
      ></Button>
      <UserLink avatar user={data.creator.value.person_view.person} />
    </div>
  {/snippet}
</Header>

<Material
  color="transparent"
  rounding="2xl"
  padding="none"
  class="bg-white dark:bg-zinc-950 dark:border-t-zinc-900 w-full overflow-auto relative flex-1 min-h-0 max-h-[66vh] md:max-h-[64vh]"
>
  <div class="h-full overflow-auto max-w-full" bind:this={chatWindow}>
    <ul id="chat-window" class="flex flex-col gap-1 flex-1 px-4 py-4 min-h-0">
      <div class="mt-auto"></div>
      <p class="mx-auto mt-auto text-slate-400 dark:text-zinc-600 text-center">
        {$t('routes.inbox.messages.conversation', {
          user:
            data.creator.value.person_view.person.name +
            '@' +
            new URL(data.creator.value.person_view.person.actor_id).hostname,
        })}
      </p>
      {#if data.message.value.private_messages.length % data.limit == 0}
        <Button
          onclick={() => loadMore(++page)}
          color="ghost"
          size="square-md"
          title={$t('common.next')}
          icon={ChevronUp}
          class="mx-auto"
        />
      {/if}
      {#each data.message.value.private_messages.toReversed() as private_message, index (private_message.private_message.id)}
        {@const messages = data.message.value.private_messages.toReversed()}
        {@const showTimestamp =
          index == 0 ||
          new Date(private_message.private_message.published).getTime() -
            new Date(messages[index - 1].private_message.published).getTime() >
            5 * 60 * 1000}

        <div
          class={private_message.creator.id ==
          data.creator.value.person_view.person.id
            ? 'self-start'
            : 'self-end'}
          in:fly|global={{
            duration: 700,
            easing: backOut,
            delay:
              index < messages.length - 15
                ? 0
                : data.message.value.private_messages.length * 50 - index * 50,
            y: -12,
          }}
          animate:flip={{ duration: 500, easing: expoOut }}
        >
          <Message
            ondelete={() => deleteMessage(private_message.private_message.id)}
            onreport={() => report(private_message)}
            message={private_message}
            primary={private_message.creator.id !=
              data.creator.value.person_view.person.id}
            {showTimestamp}
          />
        </div>
      {/each}
    </ul>
  </div>
</Material>
{#await data.message.value then message}
  <div class="sticky bottom-4 p-4">
    <form
      class={[
        'flex w-full',
        'border-slate-200 dark:border-zinc-800',
        'p-2 gap-2 backdrop-blur-xl',
        'bg-white/50 dark:bg-zinc-950/50 border rounded-2xl',
        settings.messages.fullMarkdown
          ? 'flex flex-col'
          : 'flex-row h-14 items-center',
      ]}
      onsubmit={async (e) => {
        e.preventDefault()

        const res = await sendMessage(textbox.message)
        if (!res) return

        data.message.value = {
          private_messages: [
            res.private_message_view,
            ...message.private_messages,
          ],
        }

        textbox.message = ''
      }}
    >
      {#if settings.messages.fullMarkdown}
        <MarkdownEditor
          previewButton={false}
          bind:value={textbox.message}
          class="flex-1 rounded-xl"
        />
      {:else}
        <Button
          onclick={() => (settings.messages.fullMarkdown = true)}
          size="custom"
          class="h-9 w-9"
          rounding="xl"
        >
          <Icon src={Plus} mini size="18" />
        </Button>
        <TextInput
          bind:value={textbox.message}
          class="rounded-xl! h-full flex-1 dark:bg-zinc-925!"
        />
      {/if}

      <div class="flex flex-row gap-2">
        {#if settings.messages.fullMarkdown}
          <Button
            onclick={() => (settings.messages.fullMarkdown = false)}
            size="custom"
            class="h-9 w-9"
            rounding="xl"
          >
            <Icon src={Minus} mini size="18" />
          </Button>
        {/if}
        <Button
          title={$t('common.send')}
          size="custom"
          rounding="xl"
          class="aspect-square h-9 flex-1"
          color="primary"
          submit
          loading={textbox.loading}
          disabled={textbox.loading}
          icon={PaperAirplane}
        ></Button>
      </div>
    </form>
  </div>
{/await}

<style>
  #chat-window {
    box-shadow: inset 0px -10px 15px -10px rgba(0, 0, 0, 0.1);
  }
</style>
