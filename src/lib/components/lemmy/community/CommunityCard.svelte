<script lang="ts">
  import { profile } from '$lib/auth.js'
  import {
    amMod,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import {
    Menu,
    MenuButton,
    Modal,
    Popover,
    removeToast,
    toast,
  } from 'mono-svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { client, getClient } from '$lib/lemmy.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { fullCommunityName } from '$lib/util.js'
  import type { CommunityModeratorView, CommunityView } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Cog6Tooth,
    EllipsisHorizontal,
    Fire,
    Icon,
    Minus,
    NoSymbol,
    PencilSquare,
    Plus,
    UserGroup,
  } from 'svelte-hero-icons'
  import { publishedToDate } from '$lib/components/util/date.js'

  export let community_view: CommunityView
  export let moderators: CommunityModeratorView[]

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
        community_id: community_view.community.id,
        follow: !subscribed,
      })
    } catch (error) {
      toast({ content: error as any, type: 'error' })
    }

    community_view.subscribed = subscribed ? 'NotSubscribed' : 'Subscribed'
    addSubscription(community_view.community, !subscribed)

    loading.subscribing = false
  }
  async function block() {
    if (!$profile?.jwt) return
    loading.blocking = true
    const blocked = community_view.blocked

    try {
      await getClient().blockCommunity({
        community_id: community_view.community.id,
        block: !blocked,
      })
    } catch (error) {
      toast({ content: error as any, type: 'error' })
    }

    community_view.blocked = !blocked
    loading.blocking = false
  }

  let purgingCommunity = false
  let purgeEnabled = false
  $: if (purgingCommunity) {
    purgeEnabled = false
    setTimeout(() => {
      purgeEnabled = true
    }, 3000)
  }

  async function purgeCommunity() {
    purgingCommunity = false
    const purgeToast = toast({ content: 'Purging community...', loading: true })

    try {
      await client().purgeCommunity({
        community_id: community_view.community.id,
      })
      removeToast(purgeToast)
      toast({ content: 'Purged that community.', type: 'success' })
    } catch (e) {
      toast({ content: e as any, type: 'error' })
    }
  }
</script>

{#if purgingCommunity}
  <Modal bind:open={purgingCommunity}>
    <svelte:fragment slot="title">Purging Community</svelte:fragment>
    <p>
      Purging community <span class="font-bold">
        {community_view.community.title}
      </span>
    </p>
    <p>
      Are you sure you want to do this? (The button will enable in 3 seconds.)
    </p>
    <div class="flex flex-row gap-2">
      <Button
        size="lg"
        on:click={() => (purgingCommunity = false)}
        class="flex-1"
      >
        Cancel
      </Button>
      <Button
        size="lg"
        color="danger"
        on:click={purgeCommunity}
        disabled={!purgeEnabled}
        class="flex-1"
      >
        Purge
      </Button>
    </div>
  </Modal>
{/if}

<StickyCard>
  <div class="flex flex-row gap-3 items-center">
    <div class="flex-shrink-0">
      <Avatar
        width={48}
        url={community_view.community.icon}
        alt={community_view.community.name}
      />
    </div>
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
    <RelativeDate date={publishedToDate(community_view.community.published)} />
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
  {#if moderators}
    <div class="flex flex-col gap-2 max-w-full">
      <span class="font-bold">Moderators</span>
      <div
        class="flex items-center -space-x-1 flex-wrap hover:space-x-1 transition-all
    cursor-pointer"
      >
        {#each moderators as moderator}
          <Popover openOnHover placement="top-start" class="transition-all">
            <a
              class="block ring rounded-full ring-slate-50 dark:ring-zinc-950 transition-all"
              href="/u/{moderator.moderator.name}@{new URL(
                moderator.moderator.actor_id
              ).hostname}"
              slot="target"
            >
              <Avatar
                width={28}
                url={moderator.moderator.avatar}
                alt={moderator.moderator.name}
              />
            </a>
            <span class="font-bold">{moderator.moderator.name}</span>
          </Popover>
        {/each}
      </div>
    </div>
  {/if}
  {#if $profile?.jwt}
    <div class="w-full mt-2 flex flex-col gap-2">
      <Button
        href="/create/post"
        color="ghost"
        size="lg"
        disabled={community_view.community.posting_restricted_to_mods}
      >
        <Icon src={PencilSquare} mini size="16" slot="prefix" />
        Create Post
      </Button>
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        color="ghost"
        size="lg"
        on:click={subscribe}
      >
        <Icon
          src={community_view.subscribed == 'Subscribed' ? Minus : Plus}
          mini
          size="16"
          slot="prefix"
        />
        {community_view.subscribed == 'Subscribed' ||
        community_view.subscribed == 'Pending'
          ? 'Unsubscribe'
          : 'Subscribe'}
      </Button>
      <div class="flex flex-row gap-2 ml-auto">
        {#if $profile.user && amMod($profile.user, community_view.community)}
          <Button
            href="/c/{fullCommunityName(
              community_view.community.name,
              community_view.community.actor_id
            )}/settings"
            size="square-md"
          >
            <Icon src={Cog6Tooth} mini size="16" slot="prefix" />
          </Button>
        {/if}
        <Menu placement="bottom-end">
          <Button size="square-md" slot="target">
            <Icon src={EllipsisHorizontal} size="16" mini slot="prefix" />
          </Button>
          <MenuButton color="danger-subtle" size="lg" on:click={block}>
            <Icon src={NoSymbol} size="16" mini slot="prefix" />
            {community_view.blocked ? 'Unblock' : 'Block'}
          </MenuButton>
          {#if $profile.user && isAdmin($profile.user)}
            <MenuButton
              color="danger-subtle"
              on:click={() => (purgingCommunity = !purgingCommunity)}
            >
              <Icon src={Fire} size="16" mini slot="prefix" />
              Purge
            </MenuButton>
          {/if}
        </Menu>
      </div>
    </div>
  {/if}
  <Markdown source={community_view.community.description} />
</StickyCard>
