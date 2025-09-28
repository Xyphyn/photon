<script lang="ts">
  import type { PrivateMessageView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import UserLink from '../user/UserLink.svelte'

  interface Props {
    message: PrivateMessageView
    meta?: boolean
    style?: string
  }

  let { message, meta = true, style = '' }: Props = $props()
</script>

<div class="flex flex-col gap-2 text-sm" {style}>
  {#if meta}
    <div class="flex flex-row gap-2 items-center flex-wrap">
      <span class="font-medium text-xs">From</span>
      <UserLink
        showInstance={false}
        user={message.creator}
        avatar
        avatarSize={20}
      />
      {#if profile.current?.user?.local_user_view.person.id != message.recipient.id}
        to
        <UserLink
          showInstance={false}
          user={message.recipient}
          avatar
          avatarSize={20}
        />
      {/if}
    </div>
  {/if}
  <Markdown
    rendererOptions={{ autoloadImages: false }}
    source={message.private_message.content}
  />
</div>
