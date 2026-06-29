<script lang="ts" module>
  export async function purgeCommunity(id: number) {
    const purgeToast = toast({ content: '', loading: true })

    try {
      await client().purgeCommunity({
        community_id: id,
        reason: 'Not given',
      })
      removeToast(purgeToast)
      toast({ content: t.get('toast.purgedCommunity'), type: 'success' })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }
  }

  // TODO extract instance blocking
  export async function blockInstance(id: number) {
    try {
      const loading = toast({
        content: ``,
        loading: true,
      })

      await client().userBlockInstanceCommunities({
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
  import { client } from '$lib/api/client.svelte'
  import type { CommunityModeratorView } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { settings } from '$lib/app/settings.svelte'
  import { communityLink, fullCommunityName, loader, userLink } from '$lib/app/util.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
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
  import CommunityFlair from './CommunityFlair.svelte'
  import type { CommunityModel } from './community.svelte'

  interface Props {
    community: CommunityModel
    moderators?: CommunityModeratorView[]
    class?: string
  }

  let { community, moderators = [], class: clazz = '' }: Props = $props()

  let loading = $state({
    blocking: false,
    subscribing: false,
  })

  const subscribe = () =>
    loader(
      (v) => (loading.subscribing = v),
      () => community.subscribe(),
    )

  const block = () =>
    loader(
      (v) => (loading.blocking = v),
      () => community.block(),
      () =>
        toast({
          content: !block ? t.get('toast.unblockedCommunity') : t.get('toast.blockedCommunity'),
          type: 'success',
        }),
    )

  let setFlair = $state(false)
</script>

<Modal title={$t('cards.community.flair')} bind:open={setFlair}>
  <CommunityFlair community={community.community.id} onsubmit={() => (setFlair = !setFlair)} />
</Modal>
<aside class={['min-w-full pt-0 text-slate-600 dark:text-zinc-400 flex flex-col gap-1', clazz]}>
  <EntityHeader
    name={community.community.title}
    avatar={community.community.icon}
    banner={community.community.banner}
    avatarCircle={false}
  >
    {#snippet nameDetail()}
      !{fullCommunityName(community.community.name, community.community.ap_id)}
    {/snippet}
  </EntityHeader>

  <EndPlaceholder size="xs" margin="sm">
    {$t('form.post.community')}
  </EndPlaceholder>
  {#if profile.current?.jwt}
    {@const subscribed = profile.current.user?.follows.some(
      (i) => i.community.id == community.community.id,
    )}
    <Button
      disabled={loading.subscribing}
      loading={loading.subscribing}
      size="md"
      color={subscribed ? 'secondary' : 'primary'}
      onclick={() => subscribe}
      class="px-4 relative z-[inherit]"
      alignment="left"
      icon={community.subscribed ? Check : Plus}
    >
      {subscribed ? $t('cards.community.subscribed') : $t('cards.community.subscribe')}
    </Button>
    {#if client().setFlair}
      <SidebarButton
        onclick={() => (setFlair = !setFlair)}
        icon={Tag}
        label={$t('cards.community.flair')}
      />
    {/if}
  {/if}
  {#if profile.isMod(community.community)}
    <SidebarButton
      href="{communityLink(community.community)}/settings"
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
    <MenuButton href="/modlog?community={community.community.id}">
      <Icon src={Newspaper} size="16" mini />
      {$t('cards.community.modlog')}
    </MenuButton>
    {#if profile.current?.jwt}
      {#if profile.isMod(community.community)}
        <MenuButton color="success-subtle" href="/moderation?community={community.community.id}">
          <Icon src={ShieldCheck} size="16" micro />
          {$t('routes.moderation.feed')}
        </MenuButton>
      {/if}
      <MenuButton color="danger-subtle" size="lg" onclick={block} icon={NoSymbol}>
        {community.blocked ? $t('cards.community.unblock') : $t('cards.community.block')}
      </MenuButton>
      {#if profile.current?.user}
        <MenuButton
          color="danger-subtle"
          size="lg"
          onclick={() => blockInstance(community.community.instance_id)}
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
  <EndPlaceholder size="xs" margin="sm">
    {$t('cards.site.stats')}
  </EndPlaceholder>

  <div class="flex flex-row gap-4 flex-wrap px-3">
    <LabelStat
      label={$t('cards.community.members')}
      content={community.community.subscribers.toString()}
      formatted
    />
    <LabelStat
      label={$t('content.posts')}
      content={community.community.posts.toString()}
      formatted
    />
    <LabelStat
      label={$t('cards.community.activeDay')}
      content={community.community.users_active_day.toString()}
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
      <Markdown source={community.community.summary} />
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
            instance: new URL(i.moderator.ap_id).hostname,
          }))}
        />
      </Expandable>
    {/if}
  </div>
</aside>
