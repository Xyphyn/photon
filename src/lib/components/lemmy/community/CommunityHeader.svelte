<script lang="ts">
  import { profile } from '$lib/auth'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'
  import { t } from '$lib/translations'
  import { fullCommunityName } from '$lib/util'
  import type {
    Community,
    CommunityAggregates,
    CommunityModeratorView,
    SubscribedType,
  } from 'lemmy-js-client'
  import { Button, toast, Menu, MenuButton, modal, action } from 'mono-svelte'
  import {
    Check,
    Cog6Tooth,
    Icon,
    EllipsisHorizontal,
    Plus,
    Newspaper,
    BuildingOffice2,
    Fire,
    NoSymbol,
  } from 'svelte-hero-icons'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import ItemList from '../generic/ItemList.svelte'
  import { userLink } from '$lib/lemmy/generic'
  import { formatRelativeDate } from '$lib/components/util/RelativeDate.svelte'
  import { publishedToDate } from '$lib/components/util/date'
  import { isAdmin } from '../moderation/moderation'
  import { block, blockInstance, purgeCommunity } from './CommunityCard.svelte'

  export let community: Community
  export let subscribed: SubscribedType
  export let counts: CommunityAggregates | undefined = undefined
  export let moderators: CommunityModeratorView[] = []
  export let blocked: boolean = false
  let clazz: string = ''
  export { clazz as class }
</script>

<EntityHeader
  banner={community.banner}
  avatar={community.icon}
  name={community.title}
  url="/c/{fullCommunityName(community.name, community.actor_id)}"
  stats={counts
    ? [
        {
          name: $t('cards.community.members'),
          value: counts.subscribers.toString(),
        },
        {
          name: $t('content.posts'),
          value: counts.posts.toString(),
        },
        {
          name: $t('cards.community.activeDay'),
          value: counts.users_active_day.toString(),
        },
        {
          name: $t('stats.created'),
          format: false,
          value: formatRelativeDate(publishedToDate(community.published), {
            style: 'short',
          }).toString(),
        },
      ]
    : []}
  bio={community.description}
  class={clazz}
>
  <button
    on:click={() => {
      navigator?.clipboard?.writeText?.(
        `!${fullCommunityName(community.name, community.actor_id)}`
      )
      toast({ content: $t('toast.copied') })
    }}
    class="text-sm flex gap-0 items-center"
    slot="nameDetail"
  >
    !{fullCommunityName(community.name, community.actor_id)}
  </button>
  {#if moderators.length > 0}
    <Expandable
      class="border rounded-xl bg-white/50 dark:bg-zinc-900/50 w-full p-3 px-4
dark:border-zinc-800 border-slate-300 border-opacity-50 text-slate-700 dark:text-zinc-300 transition-colors"
    >
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
  <div class="flex items-center gap-2 h-max">
    {#if $profile?.jwt}
      <Subscribe
        community={{
          community: community,
          banned_from_community: false,
          blocked: false,
          // @ts-ignore
          counts: counts ?? {},
          subscribed: subscribed,
        }}
        let:subscribe
        let:subscribing
      >
        <Button
          disabled={subscribing}
          loading={subscribing}
          size="lg"
          color={subscribed == 'NotSubscribed' ? 'primary' : 'secondary'}
          on:click={async () => {
            subscribed =
              (await subscribe())?.community_view.subscribed ?? 'NotSubscribed'
          }}
          class="flex-1 relative z-[inherit]"
        >
          <Icon
            src={subscribed != 'NotSubscribed' ? Check : Plus}
            micro
            size="16"
            slot="prefix"
          />
          {subscribed == 'Subscribed' || subscribed == 'Pending'
            ? $t('cards.community.subscribed')
            : $t('cards.community.subscribe')}
        </Button>
      </Subscribe>
    {/if}

    {#if $profile?.user && $profile.user.moderates
        .map((c) => c.community.id)
        .includes(community.id)}
      <Button
        size="square-lg"
        color="secondary"
        rounding="xl"
        href="/c/{fullCommunityName(
          community.name,
          community.actor_id
        )}/settings"
        style="height: 38px; width: 38px;"
      >
        <Icon src={Cog6Tooth} size="16" mini />
      </Button>
    {/if}
    <Menu placement="top-end">
      <Button
        rounding="xl"
        size="custom"
        slot="target"
        style="height: 38px; width: 38px;"
      >
        <Icon src={EllipsisHorizontal} size="16" mini slot="prefix" />
      </Button>
      <MenuButton href="/modlog?community={community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if $profile?.jwt}
        <MenuButton
          color="danger-subtle"
          size="lg"
          on:click={() => block(community.id, !blocked)}
        >
          <Icon src={NoSymbol} size="16" mini slot="prefix" />
          {blocked
            ? $t('cards.community.unblock')
            : $t('cards.community.block')}
        </MenuButton>
        {#if $profile?.user}
          <MenuButton
            color="danger-subtle"
            size="lg"
            on:click={() => blockInstance(community.instance_id)}
          >
            <Icon src={BuildingOffice2} size="16" mini slot="prefix" />
            {$t('cards.community.blockInstance')}
          </MenuButton>
        {/if}
        {#if $profile?.user && isAdmin($profile.user)}
          <MenuButton
            color="danger-subtle"
            on:click={() =>
              modal({
                title: $t('admin.purgeCommunity.title'),
                body: `${community.title}: ${$t('admin.purgeCommunity.warning')}`,
                actions: [
                  action({
                    close: true,
                    content: $t('common.cancel'),
                  }),
                  action({
                    action: () => purgeCommunity(community.id),
                    close: true,
                    content: $t('admin.purge'),
                    type: 'danger',
                    icon: Fire,
                  }),
                ],
                dismissable: true,
                type: 'error',
              })}
          >
            <Icon src={Fire} size="16" mini slot="prefix" />
            {$t('admin.purge')}
          </MenuButton>
        {/if}
      {/if}
    </Menu>
  </div>
</EntityHeader>
