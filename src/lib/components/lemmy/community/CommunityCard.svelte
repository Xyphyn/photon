<script lang="ts">
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import { ToastType, addToast } from '$lib/components/ui/toasts/toasts.js'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { CommunityView } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'

  export let community_view: CommunityView

  let loading = {
    blocking: false,
    subscribing: false,
  }

  async function subscribe() {
    if (!$profile?.jwt) return
    loading.subscribing = true
    const subscribed =
      community_view.subscribed == 'Subscribed' ||
      community_view.subscribed == 'Pending'

    try {
      await getClient().followCommunity({
        auth: $profile.jwt,
        community_id: community_view.community.id,
        follow: !subscribed,
      })
    } catch (error) {
      addToast('Error', error as any, ToastType.error)
    }

    community_view.subscribed = subscribed ? 'NotSubscribed' : 'Subscribed'

    loading.subscribing = false
  }
  async function block() {
    if (!$profile?.jwt) return
    loading.blocking = true
    const blocked = community_view.blocked

    try {
      await getClient().blockCommunity({
        auth: $profile.jwt,
        community_id: community_view.community.id,
        block: !blocked,
      })
    } catch (error) {
      addToast('Error', error as any, ToastType.error)
    }

    community_view.blocked = !blocked
    loading.blocking = false
  }
</script>

<StickyCard>
  <div class="flex flex-row gap-3 items-center">
    <Avatar
      width={48}
      url={community_view.community.icon}
      alt={community_view.community.name}
    />
    <div class="flex flex-col gap-0">
      <h1 class="font-bold text-xl">{community_view.community.title}</h1>
      <span class="dark:text-zinc-400 text-slate-600 text-sm">
        !{community_view.community.name}@{new URL(
          community_view.community.actor_id
        ).hostname}
      </span>
    </div>
  </div>
  <span class="flex flex-row items-center gap-1 text-sm">
    <Icon src={Calendar} width={16} height={16} mini />
    <RelativeDate date={new Date(community_view.community.published + 'Z')} />
  </span>
  <div class="text-sm flex flex-row flex-wrap gap-3">
    <span class="flex flex-row items-center gap-1">
      <Icon src={UserGroup} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.subscribers} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={PencilSquare} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.posts} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.comments} />
    </span>
  </div>
  {#if $profile?.jwt}
    <div class="w-full mt-2 flex flex-col gap-2">
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        color="ghost"
        size="lg"
        on:click={subscribe}
      >
        {community_view.subscribed == 'Subscribed' ||
        community_view.subscribed == 'Pending'
          ? 'Unsubscribe'
          : 'Subscribe'}
      </Button>
      <Button
        disabled={loading.blocking}
        loading={loading.blocking}
        color="danger"
        size="lg"
        on:click={block}
      >
        {community_view.blocked ? 'Unblock' : 'Block'}
      </Button>
    </div>
  {/if}
  <Markdown source={community_view.community.description} />
</StickyCard>
