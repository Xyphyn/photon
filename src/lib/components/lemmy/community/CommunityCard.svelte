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
  import { client, getClient } from '$lib/lemmy.svelte.js'
  import { errorMessage } from '$lib/lemmy/error'
  import { userLink } from '$lib/lemmy/generic'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { settings } from '$lib/settings.svelte'
  import { fullCommunityName } from '$lib/util.svelte.js'
  import type { CommunityModeratorView, CommunityView } from 'lemmy-js-client'
  import {
    action,
    Button,
    Menu,
    MenuButton,
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
  } from 'svelte-hero-icons'
  import ItemList from '../generic/ItemList.svelte'

  let loading = $state({
    blocking: false,
    subscribing: false,
  })

  async function subscribe() {
    if (!profile.current?.jwt) return
    loading.subscribing = true
    const subscribed =
      community_view.subscribed == 'Subscribed' ||
      community_view.subscribed == 'Pending'

    try {
      await getClient().followCommunity({
        community_id: community_view.community.id,
        follow: !subscribed,
      })
    } catch (err) {
      toast({ content: errorMessage(err as string), type: 'error' })
    }

    community_view.subscribed = subscribed ? 'NotSubscribed' : 'Subscribed'
    addSubscription(community_view.community, !subscribed)

    loading.subscribing = false
  }
  interface Props {
    community_view: CommunityView
    moderators?: CommunityModeratorView[]
    class?: string
  }

  let {
    community_view = $bindable(),
    moderators = [],
    class: clazz = '',
  }: Props = $props()
</script>

<div
  class={[
    'min-w-full pt-0 text-slate-600 dark:text-zinc-400 flex flex-col gap-4 text-sm',
    clazz,
  ]}
>
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

  <div class="flex flex-col gap-1">
    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    <Expandable bind:open={settings.expand.about} class="pt-0!">
      {#snippet title()}
        <span class="py-1 px-1 flex gap-1 items-center w-full">
          {$t('cards.site.about')}
          <hr
            class="w-full flex-1 ml-1 border-slate-200 dark:border-zinc-800"
          />
        </span>
      {/snippet}
      <Markdown source={community_view.community.description} />
    </Expandable>

    <hr class="border-slate-200 dark:border-zinc-900 my-1" />
    <Expandable bind:open={settings.expand.stats}>
      {#snippet title()}
        <span class="py-1 px-1 flex gap-1 items-center w-full">
          {$t('cards.site.stats')}
          <hr
            class="w-full flex-1 ml-1 border-slate-200 dark:border-zinc-800"
          />
        </span>
      {/snippet}
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
      <hr class="border-slate-200 dark:border-zinc-900 my-1" />
      <Expandable bind:open={settings.expand.team}>
        {#snippet title()}
          <span class="py-1 px-1 flex gap-1 items-center w-full">
            {$t('cards.community.moderators')}

            <hr
              class="w-full flex-1 ml-1 border-slate-200 dark:border-zinc-800"
            />
          </span>
        {/snippet}
        <ItemList
          items={moderators.map(m => ({
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
  <div class="flex flex-row items-center gap-1 sticky bottom-0 w-full">
    {#if profile.current?.jwt}
      <Button
        disabled={loading.subscribing}
        loading={loading.subscribing}
        size="md"
        rounding="pill"
        color={community_view.subscribed == 'Subscribed'
          ? 'secondary'
          : 'primary'}
        onclick={subscribe}
        class="px-4 relative z-[inherit]"
      >
        {#snippet prefix()}
          <Icon
            src={community_view.subscribed == 'Subscribed' ? Check : Plus}
            mini
            size="16"
          />
        {/snippet}
        {community_view.subscribed == 'Subscribed' ||
        community_view.subscribed == 'Pending'
          ? $t('cards.community.subscribed')
          : $t('cards.community.subscribe')}
      </Button>
    {/if}
    {#if profile.current?.user && amMod(profile.current.user, community_view.community)}
      <Button
        href="/c/{fullCommunityName(
          community_view.community.name,
          community_view.community.actor_id,
        )}/settings"
        size="square-md"
        rounding="pill"
      >
        {#snippet prefix()}
          <Icon src={Cog6Tooth} mini size="16" />
        {/snippet}
      </Button>
    {/if}
    <Menu placement="top-end">
      {#snippet target()}
        <Button size="square-md" rounding="pill">
          {#snippet prefix()}
            <Icon src={EllipsisHorizontal} size="16" mini />
          {/snippet}
        </Button>
      {/snippet}
      <MenuButton href="/modlog?community={community_view.community.id}">
        <Icon src={Newspaper} size="16" mini />
        {$t('cards.community.modlog')}
      </MenuButton>
      {#if profile.current?.jwt}
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
  </div>
</div>
