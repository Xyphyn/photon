<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { Community, CommunityModeratorView } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { communityLink, fullCommunityName, loader, userLink } from '$lib/app/util.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import { action, Button, Expandable, Menu, MenuButton, Modal, modal, toast } from 'mono-svelte'
  import { formatRelativeDate } from 'mono-svelte/util/RelativeDate.svelte'
  import {
    BuildingOffice2,
    Check,
    Cog6Tooth,
    EllipsisHorizontal,
    Fire,
    Icon,
    Newspaper,
    NoSymbol,
    Plus,
    ShieldCheck,
    Tag,
  } from 'svelte-hero-icons/dist'
  import { blockInstance, purgeCommunity } from './CommunityCard.svelte'
  import CommunityFlair from './CommunityFlair.svelte'
  import { CommunityModel } from './community.svelte'

  interface Props {
    community: Community
    subscribed: boolean
    moderators?: CommunityModeratorView[]
    counts?: boolean
    blocked?: boolean
    banner?: boolean
    class?: string
    compact?: 'always' | 'lg'
    avatarCircle?: boolean
  }

  let {
    community: passedCommunity = $bindable(),
    subscribed = $bindable(),
    moderators = [],
    counts = true,
    blocked = false,
    banner = !(settings.nsfwBlur && passedCommunity.nsfw),
    class: clazz = '',
    compact,
    ...rest
  }: Props = $props()

  let community = new CommunityModel({ can_mod: true, community: passedCommunity, tags: [] })

  let setFlair = $state(false)
  let subscribing = $state(false)

  const subscribe = () =>
    loader(
      (v) => (subscribing = v),
      () => community.subscribe(),
    )
</script>

<Modal title={$t('cards.community.flair')} bind:open={setFlair}>
  <CommunityFlair community={community.community.id} onsubmit={() => (setFlair = !setFlair)} />
</Modal>

<EntityHeader
  {...rest}
  {compact}
  banner={banner ? community.community.banner : undefined}
  avatar={community.community.icon}
  name={community.community.title}
  url={communityLink(community.community)}
  stats={counts
    ? [
        {
          name: $t('cards.community.members'),
          value: community.community.subscribers.toString(),
        },
        {
          name: $t('content.posts'),
          value: community.community.posts.toString(),
        },
        {
          name: $t('cards.community.activeDay'),
          value: community.community.users_active_day.toString(),
        },
        {
          name: $t('stats.created'),
          format: false,
          value: formatRelativeDate(publishedToDate(community.community.published_at), {
            style: 'short',
          }).toString(),
        },
      ]
    : []}
  bio={community.community.summary}
  class={['tracking-normal', clazz]}
>
  {#snippet nameDetail()}
    <button
      onclick={() => {
        navigator?.clipboard?.writeText?.(
          `!${fullCommunityName(community.community.name, community.community.ap_id)}`,
        )
        toast({ content: $t('toast.copied') })
      }}
      class="text-sm flex gap-0 items-center"
    >
      !{fullCommunityName(community.community.name, community.community.ap_id)}
    </button>
  {/snippet}
  {#if moderators.length > 0}
    <Expandable class={[compact == 'lg' && 'lg:hidden']}>
      {#snippet title()}
        {$t('cards.community.moderators')}
        <hr class="flex-1 border-slate-200 dark:border-zinc-800 mx-3" />
      {/snippet}
      <ItemList
        items={moderators.map((m) => ({
          id: m.moderator.id,
          name: m.moderator.name,
          url: userLink(m.moderator),
          avatar: m.moderator.avatar,
          instance: new URL(m.moderator.ap_id).hostname,
        }))}
      />
    </Expandable>
  {/if}
  <div class={['flex items-center gap-2 h-max w-max', compact == 'lg' && 'lg:hidden']}>
    {#if profile.current?.jwt}
      <Button
        disabled={subscribing}
        loading={subscribing}
        color={community.subscribed ? 'primary' : 'secondary'}
        onclick={subscribe}
        class="relative z-[inherit]"
        size="lg"
        icon={community.subscribed ? Check : Plus}
      >
        {community.subscribed ? $t('cards.community.subscribed') : $t('cards.community.subscribe')}
      </Button>

      {#if client().setFlair}
        <Button
          size="square-lg"
          onclick={() => (setFlair = !setFlair)}
          aria-label={$t('cards.community.flair')}
        >
          <Icon src={Tag} size="16" micro />
        </Button>
      {/if}
    {/if}

    {#if profile.isMod(community.community) || profile.isAdmin}
      <Button
        color="secondary"
        size="square-lg"
        href="{communityLink(community.community)}/settings"
      >
        <Icon src={Cog6Tooth} size="16" mini />
      </Button>
    {/if}
    <Menu placement="top-end">
      {#snippet target(attachment)}
        <Button {@attach attachment} size="square-lg" icon={EllipsisHorizontal}></Button>
      {/snippet}
      <MenuButton href="/modlog?community={community.community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if profile.isMod(community.community)}
        <MenuButton color="success-subtle" href="/moderation?community={community.community.id}">
          <Icon src={ShieldCheck} size="16" micro />
          {$t('routes.moderation.feed')}
        </MenuButton>
      {/if}
      {#if profile.current?.jwt}
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() => community.block(!community.blocked)}
          icon={NoSymbol}
        >
          {blocked ? $t('cards.community.unblock') : $t('cards.community.block')}
        </MenuButton>
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() => blockInstance(community.community.instance_id)}
          icon={BuildingOffice2}
        >
          {$t('cards.community.blockInstance')}
        </MenuButton>
        {#if profile.isAdmin}
          <MenuButton
            color="danger-subtle"
            onclick={() =>
              modal({
                title: $t('admin.purgeCommunity.title'),
                body: `${community.community.title}: ${$t('admin.purgeCommunity.warning')}`,
                actions: [
                  action({
                    close: true,
                    content: $t('common.cancel'),
                  }),
                  action({
                    action: () => purgeCommunity(community.community.id),
                    close: true,
                    content: $t('admin.purge'),
                    type: 'danger',
                    icon: Fire,
                  }),
                ],
                dismissable: true,
                type: 'error',
              })}
            icon={Fire}
          >
            {$t('admin.purge')}
          </MenuButton>
        {/if}
      {/if}
    </Menu>
  </div>
</EntityHeader>
