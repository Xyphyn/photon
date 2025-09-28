<script lang="ts" module>
  import { client, getClient } from '$lib/api/client.svelte'
  import type { CommunityModeratorView, CommunityView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { fullCommunityName, userLink } from '$lib/app/util.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import Entity from '$lib/ui/generic/Entity.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import LabelStat from '$lib/ui/info/LabelStat.svelte'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import SidebarButton from '$lib/ui/sidebar/SidebarButton.svelte'
  import {
    action,
    Button,
    Expandable,
    Menu,
    MenuButton,
    Modal,
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
    Tag,
  } from 'svelte-hero-icons/dist'
  import { addSubscription } from '../user'
  import CommunityFlair from './CommunityFlair.svelte'

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

  let setFlair = $state(false)

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
  <Modal title={$t('cards.community.flair')} bind:open={setFlair}>
    <CommunityFlair
      community={community_view.community.id}
      onsubmit={() => (setFlair = !setFlair)}
    />
  </Modal>
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
        (i) => i.community.id == community_view.community.id,
      )}
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        size="md"
        color={subscribed ? 'secondary' : 'primary'}
        onclick={() => subscribe(community_view)}
        class="px-4 relative z-[inherit]"
        alignment="left"
        icon={community_view.subscribed == 'Subscribed' ? Check : Plus}
      >
        {subscribed
          ? $t('cards.community.subscribed')
          : $t('cards.community.subscribe')}
      </Button>
      {#if client().setFlair}
        <SidebarButton
          onclick={() => (setFlair = !setFlair)}
          icon={Tag}
          label={$t('cards.community.flair')}
        />
      {/if}
    {/if}
    {#if profile.isMod(community_view.community)}
      <SidebarButton
        href="/c/{fullCommunityName(
          community_view.community.name,
          community_view.community.actor_id,
        )}/settings"
        icon={Cog6Tooth}
        label={$t('routes.profile.edit')}
      />
    {/if}
    <Menu placement="bottom-start">
      {#snippet target(attachment)}
        <SidebarButton
          {@attach attachment}
          label={$t('post.actions.more.label')}
          icon={EllipsisHorizontal}
        />
      {/snippet}
      <MenuButton href="/modlog?community={community_view.community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if profile.current?.jwt}
        {#if profile.isMod(community_view.community)}
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
          icon={NoSymbol}
        >
          {community_view.blocked
            ? $t('cards.community.unblock')
            : $t('cards.community.block')}
        </MenuButton>
        {#if profile.current?.user}
          <MenuButton
            color="danger-subtle"
            size="lg"
            onclick={() => blockInstance(community_view.community.instance_id)}
            icon={BuildingOffice2}
          >
            {$t('cards.community.blockInstance')}
          </MenuButton>
        {/if}
        {#if profile.isAdmin}
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
            icon={Fire}
          >
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
            items={moderators.map((i) => ({
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
