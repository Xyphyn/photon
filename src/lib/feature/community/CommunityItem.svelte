<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { locale, t } from '$lib/app/i18n'
  import { communityLink, loader } from '$lib/app/util.svelte'
  import CommonItem from '$lib/ui/layout/CommonItem.svelte'
  import { Button, modal } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import {
    Check,
    ExclamationTriangle,
    Icon,
    InformationCircle,
    MapPin,
    NoSymbol,
    Plus,
    Trash,
  } from 'svelte-hero-icons/dist'
  import { SvelteURL } from 'svelte/reactivity'
  import CommunityCard from './CommunityCard.svelte'
  import type { CommunityModel } from './community.svelte'

  interface Props {
    community: CommunityModel
    view?: 'cozy' | 'compact'
    showCounts?: boolean
    children?: Snippet
  }

  let { community = $bindable(), view = 'compact', showCounts = true, children }: Props = $props()

  let subscribing = $state(false)
  const subscribe = () => loader((v) => (subscribing = v), community.subscribe)
</script>

{#snippet communityInfo()}
  <CommunityCard {community} />
{/snippet}

<CommonItem
  icon={community.community.icon}
  href={communityLink(community.community)}
  title={community.community.title ?? community.community.name}
  detail="{new SvelteURL(community.community.ap_id).hostname}{!showCounts
    ? ` • ${Intl.NumberFormat($locale, { notation: 'compact' }).format(community.community.subscribers)}`
    : ''}"
  orientation={view == 'cozy' ? 'vertical' : 'horizontal'}
>
  {#if !children}
    {#if community.community.deleted}
      <span title={$t('post.badges.deleted')}>
        <Icon src={Trash} class="text-red-500 inline" micro size="14" />
      </span>
    {/if}
    {#if community.community.nsfw}
      <span title={$t('post.badges.nsfw')}>
        <Icon src={ExclamationTriangle} class="text-red-500 inline" micro size="14" />
      </span>
    {/if}
    {#if community.banned}
      <span title={$t('comment.banned')}>
        <Icon src={NoSymbol} class="text-red-500 inline" micro size="14" />
      </span>
    {/if}
    {#if community.community.visibility == 'local_only_private' || community.community.visibility == 'local_only_public'}
      <span title={$t('routes.admin.config.listingType.local')}>
        <Icon src={MapPin} class="text-green-500 inline" micro size="14" />
      </span>
    {/if}
    <Button
      rounding="xl"
      color="ghost"
      onclick={() => modal({ title: $t('form.post.community'), snippet: communityInfo })}
      aria-label={$t('common.info')}
      size="square-md"
    >
      <Icon src={InformationCircle} size="16" mini />
    </Button>
    <Button
      disabled={subscribing || !profile.current?.jwt}
      loading={subscribing}
      onclick={subscribe}
      size="custom"
      title={community.subscribed
        ? $t('cards.community.subscribed')
        : $t('cards.community.subscribe')}
      color={community.subscribed ? 'secondary' : 'primary'}
      rounding="xl"
      class={[
        community.subscribed && 'text-slate-600 dark:text-zinc-400',
        ' h-8.5 rounded-full',
        view == 'compact' ? 'aspect-square @md:px-2 @md:min-w-30 @md:aspect-auto' : 'px-3',
      ]}
      icon={community.subscribed ? Check : Plus}
    >
      <span class={[view == 'compact' && 'hidden', '@md:block']}>
        {#if community.subscribed}
          {$t('cards.community.subscribed')}
        {:else}
          {$t('cards.community.subscribe')}
        {/if}
      </span>
    </Button>
  {:else}
    {@render children?.()}
  {/if}
</CommonItem>
