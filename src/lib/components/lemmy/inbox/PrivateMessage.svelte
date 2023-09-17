<script lang="ts">
  import { profile } from '$lib/auth.js'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import type { PrivateMessageView } from 'lemmy-js-client'
  import { Icon, PaperAirplane } from 'svelte-hero-icons'

  export let message: PrivateMessageView
</script>

<div class="flex flex-col gap-2">
  <div class="flex flex-row gap-2 items-center flex-wrap">
    <span class="font-medium text-xs">From</span>
    <UserLink
      showInstance={false}
      user={message.creator}
      avatar
      avatarSize={20}
      shownBadges={{
        admin: true,
        banned: true,
        bot: true,
        you: $profile?.user?.local_user_view.person.id == message.creator.id,
      }}
    />
    {#if $profile?.user?.local_user_view.person.id != message.recipient.id}
      to
      <UserLink
        showInstance={false}
        user={message.recipient}
        avatar
        avatarSize={20}
        shownBadges={{
          admin: true,
          banned: true,
          bot: true,
          you:
            $profile?.user?.local_user_view.person.id == message.recipient.id,
        }}
      />
    {/if}
  </div>
  <Markdown source={message.private_message.content} />
</div>
