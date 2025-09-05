<script lang="ts" module>
  export async function block(id: number, block: boolean) {
    try {
      const loading = toast({
        content: ``,
        loading: true,
      })

      await getClient().blockCommunity({
        community_id: id,
        block: block,
      })

      removeToast(loading)

      toast({
        content: !block
          ? t.get('toast.unblockedCommunity')
          : t.get('toast.blockedCommunity'),
        type: 'success',
      })

      return block
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
      return !block
    }
  }

  export async function purgeCommunity(id: number) {
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgeCommunity({
        community_id: id,
      })
      removeToast(purgeToast)
      toast({ content: t.get('toast.purgedCommunity'), type: 'success' })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }
  }

  export async function blockInstance(id: number) {
    try {
      const loading = toast({
        content: ``,
        loading: true,
      })

      await getClient().blockInstance({
        instance_id: id,
        block: true,
      })

      removeToast(loading)

      toast({
        content: `Successfully blocked that instance.`,
        type: 'success',
      })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }
  }
</script>

<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import {
    amMod,
    isAdmin,
  } from '$lib/components/lemmy/moderation/moderation.js'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Entity from '$lib/components/ui/Entity.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import LabelStat from '$lib/components/ui/LabelStat.svelte'
  import { t } from '$lib/i18n/translations'
  import { client, getClient } from '$lib/client/lemmy.svelte'
  import { errorMessage } from '$lib/lemmy/error'
  import { userLink } from '$lib/lemmy/generic'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { settings } from '$lib/settings.svelte'
  import { fullCommunityName } from '$lib/util.svelte.js'
  import type { CommunityModeratorView, CommunityView } from '$lib/client/types'
  import {
    action,
    Button,
    Menu,
    MenuButton,
    modal,
    removeToast,
    Spinner,
    toast,
  } from 'mono-svelte'
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
  } from 'svelte-hero-icons'
  import ItemList from '../generic/ItemList.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'

  let loading = $state({
    blocking: false,
    subscribing: false,
  })

  async function subscribe(community: CommunityView) {
    if (!profile.current?.jwt) return
    loading.subscribing = true
    const subscribed =
      community.subscribed == 'Subscribed' || community.subscribed == 'Pending'

    try {
      await getClient().followCommunity({
        community_id: community.community.id,
        follow: !subscribed,
      })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }

    community.subscribed = subscribed ? 'NotSubscribed' : 'Subscribed'
    addSubscription(community.community, !subscribed)

    loading.subscribing = false
  }
  interface Props {
    community_view: CommunityView | Promise<CommunityView>
    moderators?: CommunityModeratorView[]
    class?: string
  }

  let {
    community_view = $bindable(),
    moderators = [],
    class: clazz = '',
  }: Props = $props()
</script>

{#await community_view}
  <div
    class="w-full h-full grid place-items-center"
    role="status"
    aria-label={$t('aria.loading')}
  >
    <Spinner width={24} />
  </div>
{:then community_view}
  <aside
    class={[
      'min-w-full pt-0 text-slate-600 dark:text-zinc-400 flex flex-col gap-1',
      clazz,
    ]}
  >
    <div class="px-3 overflow-hidden">
      <Entity
        name={community_view.community.title}
        label="!{fullCommunityName(
          community_view.community.name,
          community_view.community.actor_id,
        )}"
      >
        {#snippet customIcon()}
          <Avatar
            width={32}
            url={community_view.community.icon}
            alt={community_view.community.name}
            circle={false}
          />
        {/snippet}
      </Entity>
    </div>

    <EndPlaceholder size="xs" margin="sm">
      {$t('form.post.community')}
    </EndPlaceholder>
    {#if profile.current?.jwt}
      {@const subscribed = profile.current.user?.follows.some(
        i => i.community.id == community_view.community.id,
      )}
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        size="md"
        rounding="xl"
        color={subscribed ? 'secondary' : 'primary'}
        onclick={() => subscribe(community_view)}
        class="px-4 relative z-[inherit]"
        alignment="left"
      >
        {#snippet prefix()}
          <Icon
            src={community_view.subscribed == 'Subscribed' ? Check : Plus}
            mini
            size="16"
          />
        {/snippet}
        {subscribed
          ? $t('cards.community.subscribed')
          : $t('cards.community.subscribe')}
      </Button>
    {/if}
    {#if profile.current?.user && amMod(profile.current.user, community_view.community)}
      <SidebarButton
        href="/c/{fullCommunityName(
          community_view.community.name,
          community_view.community.actor_id,
        )}/settings"
        rounding="xl"
        icon={Cog6Tooth}
        label={$t('routes.profile.edit')}
      />
    {/if}
    <Menu placement="bottom-start">
      {#snippet target(attachment)}
        <SidebarButton
          {@attach attachment}
          label={$t('post.actions.more.label')}
          rounding="xl"
          icon={EllipsisHorizontal}
        />
      {/snippet}
      <MenuButton href="/modlog?community={community_view.community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if profile.current?.jwt}
        {#if profile.current.user && amMod(profile.current.user, community_view.community)}
          <MenuButton
            color="success-subtle"
            href="/moderation?community={community_view.community.id}"
          >
            <Icon src={ShieldCheck} size="16" micro />
            {$t('routes.moderation.feed')}
          </MenuButton>
        {/if}
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() =>
            block(community_view.community.id, !community_view.blocked)}
        >
          {#snippet prefix()}
            <Icon src={NoSymbol} size="16" mini />
          {/snippet}
          {community_view.blocked
            ? $t('cards.community.unblock')
            : $t('cards.community.block')}
        </MenuButton>
        {#if profile.current?.user}
          <MenuButton
            color="danger-subtle"
            size="lg"
            onclick={() => blockInstance(community_view.community.instance_id)}
          >
            {#snippet prefix()}
              <Icon src={BuildingOffice2} size="16" mini />
            {/snippet}
            {$t('cards.community.blockInstance')}
          </MenuButton>
        {/if}
        {#if profile.current?.user && isAdmin(profile.current.user)}
          <MenuButton
            color="danger-subtle"
            onclick={() =>
              modal({
                title: $t('admin.purgeCommunity.title'),
                body: `${community_view.community.title}: ${$t('admin.purgeCommunity.warning')}`,
                actions: [
                  action({
                    close: true,
                    content: $t('common.cancel'),
                  }),
                  action({
                    action: () => purgeCommunity(community_view.community.id),
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
            {#snippet prefix()}
              <Icon src={Fire} size="16" mini />
            {/snippet}
            {$t('admin.purge')}
          </MenuButton>
        {/if}
      {/if}
    </Menu>
    <EndPlaceholder size="xs" margin="sm">
      {$t('cards.site.stats')}
    </EndPlaceholder>

    <div class="flex flex-row gap-4 flex-wrap px-3">
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
      <LabelStat
        label={$t('cards.community.activeDay')}
        content={community_view.counts.users_active_day.toString()}
        formatted
      />
    </div>

    <EndPlaceholder size="xs" margin="sm">
      {$t('common.info')}
    </EndPlaceholder>
    <div class="space-y-3 px-1.5 text-sm">
      <Expandable bind:open={settings.expand.about}>
        {#snippet title()}
          <span class="px-2 py-1 w-full">
            {$t('cards.site.about')}
          </span>
        {/snippet}
        <Markdown source={community_view.community.description} />
      </Expandable>

      {#if moderators && moderators.length > 0}
        <Expandable bind:open={settings.expand.team}>
          {#snippet title()}
            <span class="px-2 py-1 w-full">
              {$t('cards.community.moderators')}
            </span>
          {/snippet}
          <ItemList
            items={moderators.map(i => ({
              id: i.moderator.id,
              name: i.moderator.display_name || i.moderator.name,
              url: userLink(i.moderator),
              avatar: i.moderator.avatar,
              instance: new URL(i.moderator.actor_id).hostname,
            }))}
          />
        </Expandable>
      {/if}
    </div>
  </aside>
{/await}
