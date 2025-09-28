<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type {
    Community,
    CommunityAggregates,
    CommunityModeratorView,
    SubscribedType,
  } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { fullCommunityName, userLink } from '$lib/app/util.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import {
    action,
    Button,
    Expandable,
    Menu,
    MenuButton,
    Modal,
    modal,
    toast,
  } from 'mono-svelte'
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
  import Subscribe from '../../../routes/communities/Subscribe.svelte'
  import { block, blockInstance, purgeCommunity } from './CommunityCard.svelte'
  import CommunityFlair from './CommunityFlair.svelte'

  interface Props {
    community: Community
    subscribed: SubscribedType
    counts?: CommunityAggregates | undefined
    moderators?: CommunityModeratorView[]
    blocked?: boolean
    banner?: boolean
    class?: string
    compact?: 'always' | 'lg'
    avatarCircle?: boolean
  }

  let {
    community = $bindable(),
    subscribed = $bindable(),
    counts = undefined,
    moderators = [],
    blocked = false,
    banner = !(settings.nsfwBlur && community.nsfw),
    class: clazz = '',
    compact,
    ...rest
  }: Props = $props()

  let setFlair = $state(false)
</script>

<Modal title={$t('cards.community.flair')} bind:open={setFlair}>
  <CommunityFlair
    community={community.id}
    onsubmit={() => (setFlair = !setFlair)}
  />
</Modal>

<EntityHeader
  {...rest}
  {compact}
  banner={banner ? community.banner : undefined}
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
  class={['tracking-normal', clazz]}
>
  {#snippet nameDetail()}
    <button
      onclick={() => {
        navigator?.clipboard?.writeText?.(
          `!${fullCommunityName(community.name, community.actor_id)}`,
        )
        toast({ content: $t('toast.copied') })
      }}
      class="text-sm flex gap-0 items-center"
    >
      !{fullCommunityName(community.name, community.actor_id)}
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
          instance: new URL(m.moderator.actor_id).hostname,
        }))}
      />
    </Expandable>
  {/if}
  <div
    class={[
      'flex items-center gap-2 h-max w-max',
      compact == 'lg' && 'lg:hidden',
    ]}
  >
    {#if profile.current?.jwt}
      <Subscribe
        community={{
          community: community,
          banned_from_community: false,
          blocked: false,
          counts: counts!,
          subscribed: subscribed,
        }}
      >
        {#snippet children({ subscribe, subscribing })}
          <Button
            disabled={subscribing}
            loading={subscribing}
            color={subscribed == 'NotSubscribed' ? 'primary' : 'secondary'}
            onclick={async () => {
              subscribed =
                (await subscribe())?.community_view.subscribed ??
                'NotSubscribed'
            }}
            class="relative z-[inherit]"
            rounding="pill"
            icon={subscribed != 'NotSubscribed' ? Check : Plus}
          >
            {subscribed == 'Subscribed' || subscribed == 'Pending'
              ? $t('cards.community.subscribed')
              : $t('cards.community.subscribe')}
          </Button>
        {/snippet}
      </Subscribe>

      {#if client().setFlair}
        <Button
          size="custom"
          class="h-9 aspect-square"
          rounding="pill"
          onclick={() => (setFlair = !setFlair)}
          aria-label={$t('cards.community.flair')}
        >
          <Icon src={Tag} size="16" micro />
        </Button>
      {/if}
    {/if}

    {#if profile.current?.user && profile.current.user.moderates
        .map((c) => c.community.id)
        .includes(community.id)}
      <Button
        color="secondary"
        size="custom"
        rounding="pill"
        class="h-9 aspect-square"
        href="/c/{fullCommunityName(
          community.name,
          community.actor_id,
        )}/settings"
      >
        <Icon src={Cog6Tooth} size="16" mini />
      </Button>
    {/if}
    <Menu placement="top-end">
      {#snippet target(attachment)}
        <Button
          {@attach attachment}
          size="custom"
          rounding="pill"
          class="h-8.5 aspect-square"
          icon={EllipsisHorizontal}
        ></Button>
      {/snippet}
      <MenuButton href="/modlog?community={community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if profile.isMod(community)}
        <MenuButton
          color="success-subtle"
          href="/moderation?community={community.id}"
        >
          <Icon src={ShieldCheck} size="16" micro />
          {$t('routes.moderation.feed')}
        </MenuButton>
      {/if}
      {#if profile.current?.jwt}
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() => block(community.id, !blocked)}
          icon={NoSymbol}
        >
          {blocked
            ? $t('cards.community.unblock')
            : $t('cards.community.block')}
        </MenuButton>
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() => blockInstance(community.instance_id)}
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
            icon={Fire}
          >
            {$t('admin.purge')}
          </MenuButton>
        {/if}
      {/if}
    </Menu>
  </div>
</EntityHeader>
