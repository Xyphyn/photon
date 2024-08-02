<script lang="ts">
  import { profile } from '$lib/auth.js'
  import {
    amMod,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import { Menu, MenuButton, Modal, removeToast, toast } from 'mono-svelte'
  import { client, getClient } from '$lib/lemmy.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { fullCommunityName } from '$lib/util.js'
  import type { CommunityModeratorView, CommunityView } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import {
    BuildingOffice2,
    Calendar,
    ChartBar,
    Check,
    Cog6Tooth,
    EllipsisHorizontal,
    Fire,
    Icon,
    InformationCircle,
    Newspaper,
    NoSymbol,
    Plus,
  } from 'svelte-hero-icons'
  import CommunityLink from './CommunityLink.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import LabelStat from '$lib/components/ui/LabelStat.svelte'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import ItemList from '../generic/ItemList.svelte'
  import { userLink } from '$lib/lemmy/generic'
  import { t } from '$lib/translations'
  import Entity from '$lib/components/ui/Entity.svelte'
  import { userSettings } from '$lib/settings'

  export let community_view: CommunityView
  export let moderators: CommunityModeratorView[] = []

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
      const loading = toast({
        content: ``,
        loading: true,
      })

      await getClient().blockCommunity({
        community_id: community_view.community.id,
        block: !blocked,
      })

      removeToast(loading)

      toast({
        content: blocked
          ? $t('toast.unblockedCommunity')
          : $t('toast.blockedCommunity'),
        type: 'success',
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
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgeCommunity({
        community_id: community_view.community.id,
      })
      removeToast(purgeToast)
      toast({ content: $t('toast.purgedCommunity'), type: 'success' })
    } catch (e) {
      toast({ content: e as any, type: 'error' })
    }
  }

  async function blockInstance() {
    if (!$profile?.jwt) return
    try {
      const loading = toast({
        content: ``,
        loading: true,
      })

      await getClient().blockInstance({
        instance_id: community_view.community.instance_id,
        block: true,
      })

      removeToast(loading)

      toast({
        content: `Successfully blocked that instance.`,
        type: 'success',
      })
    } catch (error) {
      toast({ content: error as any, type: 'error' })
    }
  }
</script>

{#if purgingCommunity}
  <Modal bind:open={purgingCommunity}>
    <svelte:fragment slot="title">
      {$t('admin.purgeCommunity.title')}
    </svelte:fragment>
    <CommunityLink avatar community={community_view.community} />
    <p>
      {$t('admin.purgeCommunity.warning')}
    </p>
    <div class="flex flex-row gap-2">
      <Button
        size="lg"
        on:click={() => (purgingCommunity = false)}
        class="flex-1"
      >
        {$t('common.cancel')}
      </Button>
      <Button
        size="lg"
        color="danger"
        on:click={purgeCommunity}
        disabled={!purgeEnabled}
        class="flex-1"
      >
        {$t('admin.purge')}
      </Button>
    </div>
  </Modal>
{/if}

<StickyCard
  class="min-w-full pt-0 text-slate-600 dark:text-zinc-400 {$$props.class}"
>
  <Entity
    name={community_view.community.title}
    label="!{fullCommunityName(
      community_view.community.name,
      community_view.community.actor_id
    )}"
  >
    <Avatar
      width={32}
      url={community_view.community.icon}
      alt={community_view.community.name}
      circle={false}
      slot="icon"
    />
  </Entity>

  <div
    class="flex flex-col divide-y divide-slate-200 dark:divide-zinc-800 [&>*]:py-3"
  >
    <Expandable bind:open={$userSettings.expand.about} class="!pt-0">
      <svelte:fragment slot="title">
        <Icon src={InformationCircle} size="15" mini />
        {$t('cards.site.about')}
      </svelte:fragment>
      <Markdown source={community_view.community.description} />
    </Expandable>

    <Expandable bind:open={$userSettings.expand.stats}>
      <svelte:fragment slot="title">
        <Icon src={ChartBar} size="15" mini />
        {$t('cards.site.stats')}
      </svelte:fragment>
      <div class="flex flex-row gap-4 flex-wrap">
        <LabelStat
          label={$t('cards.community.members')}
          content={community_view.counts.subscribers.toString()}
          formatted
        />
        <LabelStat
          label={$t('content.posts')}
          content={community_view.counts.posts.toString()}
          formatted
        />
      </div>
    </Expandable>

    {#if moderators && moderators.length > 0}
      <Expandable bind:open={$userSettings.expand.team}>
        <svelte:fragment slot="title">
          <ShieldIcon width={15} filled />
          {$t('cards.community.moderators')}
        </svelte:fragment>
        <ItemList
          items={moderators.map((m) => ({
            id: m.moderator.id,
            name: m.moderator.name,
            url: userLink(m.moderator),
            avatar: m.moderator.avatar,
            instance: new URL(m.moderator.actor_id).hostname,
          }))}
        />
      </Expandable>
    {/if}
  </div>
  <div
    class="flex flex-row items-center gap-1 sticky bottom-0 drop-shadow-xl w-full"
  >
    {#if $profile?.jwt}
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        size="md"
        color={community_view.subscribed == 'Subscribed'
          ? 'secondary'
          : 'primary'}
        on:click={subscribe}
        class="flex-1 relative z-[inherit]"
      >
        <Icon
          src={community_view.subscribed == 'Subscribed' ? Check : Plus}
          mini
          size="16"
          slot="prefix"
        />
        {community_view.subscribed == 'Subscribed' ||
        community_view.subscribed == 'Pending'
          ? $t('cards.community.subscribed')
          : $t('cards.community.subscribe')}
      </Button>
    {/if}
    {#if $profile?.user && amMod($profile.user, community_view.community)}
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
    <Menu placement="top-end">
      <Button size="square-md" slot="target" class="ml-auto">
        <Icon src={EllipsisHorizontal} size="16" mini slot="prefix" />
      </Button>
      <MenuButton href="/modlog?community={community_view.community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if $profile?.jwt}
        <MenuButton color="danger-subtle" size="lg" on:click={block}>
          <Icon src={NoSymbol} size="16" mini slot="prefix" />
          {community_view.blocked
            ? $t('cards.community.unblock')
            : $t('cards.community.block')}
        </MenuButton>
        {#if $profile?.user}
          <MenuButton color="danger-subtle" size="lg" on:click={blockInstance}>
            <Icon src={BuildingOffice2} size="16" mini slot="prefix" />
            {$t('cards.community.blockInstance')}
          </MenuButton>
        {/if}
        {#if $profile?.user && isAdmin($profile.user)}
          <MenuButton
            color="danger-subtle"
            on:click={() => (purgingCommunity = !purgingCommunity)}
          >
            <Icon src={Fire} size="16" mini slot="prefix" />
            {$t('admin.purge')}
          </MenuButton>
        {/if}
      {/if}
    </Menu>
  </div>
</StickyCard>
