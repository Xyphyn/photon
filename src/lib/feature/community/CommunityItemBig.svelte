<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { communityLink, loader } from '$lib/app/util.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import Blobs from '$lib/ui/generic/Blobs.svelte'
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
  import { optimizeImageURL } from '../post'
  import CommunityCard from './CommunityCard.svelte'
  import type { CommunityModel } from './community-model.svelte'

  interface Props {
    community: CommunityModel
    children?: Snippet
  }

  let { community = $bindable(), children }: Props = $props()

  let subscribing = $state(false)
  const subscribe = () => loader((v) => (subscribing = v), community.subscribe)
</script>

{#snippet communityInfo()}
  <CommunityCard {community} />
{/snippet}

<div
  class={[
    'flex flex-col items-start gap-2 p-4 h-full cursor-pointer',
    'rounded-[inherit] overflow-hidden hover:bg-slate-50 hover:dark:bg-zinc-925 relative z-0 transition-colors',
  ]}
>
  <a
    href={communityLink(community.community)}
    aria-label={$t('aria.postDecor.openLink')}
    class="absolute inset-0 z-10"
  ></a>
  <div
    class="-m-4 mask-b-from-25% relative h-24"
    style="min-width: calc(100% + calc(var(--spacing) * 8));"
  >
    {#if community.community.banner}
      <img
        src={optimizeImageURL(community.community.banner, 512)}
        alt=""
        class="object-cover min-h-full min-w-full"
      />
    {:else if community.community.icon}
      <img src={community.community.icon} alt="" class="object-cover blur-3xl" />
    {:else}
      <div class="scale-200 min-w-full mask-b-from-25%">
        <Blobs seed={community.community.name} />
      </div>
    {/if}
  </div>
  <div class="flex flex-row justify-between w-full items-start">
    <header class="flex-1 flex flex-col group">
      <h3 class="font-medium overflow-hidden text-ellipsis leading-5 text-xl font-display">
        {community.community.title}
      </h3>
      <p class="text-sm text-slate-600 dark:text-zinc-400">
        {new URL(community.community.ap_id).hostname}
      </p>
    </header>
    <Avatar
      url={community.community.icon}
      alt={community.community.title}
      width={48}
      circle={null}
      class="rounded-xl"
    />
  </div>
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
  <div class="flex gap-2 items-center justify-end w-full z-30 mt-auto">
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
      title={community.subscribed
        ? $t('cards.community.subscribed')
        : $t('cards.community.subscribe')}
      color={community.subscribed ? 'secondary' : 'primary'}
      class={[community.subscribed && 'text-slate-600 dark:text-zinc-400']}
      icon={community.subscribed ? Check : Plus}
    >
      <span class={['@md:block']}>
        {#if community.subscribed}
          {$t('cards.community.subscribed')}
        {:else}
          {$t('cards.community.subscribe')}
        {/if}
      </span>
    </Button>
  </div>
  {#if children}
    <div class="flex flex-row gap-2 items-center">
      {@render children?.()}
    </div>
  {/if}
</div>
