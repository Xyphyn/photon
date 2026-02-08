<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { CommunityView } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { locale, t } from '$lib/app/i18n'
  import { fullCommunityName } from '$lib/app/util.svelte'
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
  import Subscribe from '../../../routes/communities/Subscribe.svelte'
  import { addSubscription } from '../user'
  import CommunityCard from './CommunityCard.svelte'

  interface Props {
    community: CommunityView
    view?: 'cozy' | 'compact'
    showCounts?: boolean
    resolveObject?: boolean
    children?: Snippet
  }

  let {
    community = $bindable(),
    view = 'compact',
    showCounts = true,
    resolveObject,
    children,
  }: Props = $props()
</script>

{#snippet communityInfo()}
  <CommunityCard community_view={community} />
{/snippet}

<CommonItem
  icon={community.community.icon}
  href="/c/{fullCommunityName(
    community.community.name,
    community.community.actor_id,
  )}"
  title={community.community.title}
  detail="{new SvelteURL(community.community.actor_id).hostname}{!showCounts
    ? ` • ${Intl.NumberFormat($locale, { notation: 'compact' }).format(community.counts.subscribers)}`
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
        <Icon
          src={ExclamationTriangle}
          class="text-red-500 inline"
          micro
          size="14"
        />
      </span>
    {/if}
    {#if community.banned_from_community}
      <span title={$t('comment.banned')}>
        <Icon src={NoSymbol} class="text-red-500 inline" micro size="14" />
      </span>
    {/if}
    {#if community.community.visibility == 'LocalOnly'}
      <span title={$t('routes.admin.config.listingType.local')}>
        <Icon src={MapPin} class="text-green-500 inline" micro size="14" />
      </span>
    {/if}
    <Button
      rounding="xl"
      color="ghost"
      onclick={() =>
        modal({ title: $t('form.post.community'), snippet: communityInfo })}
      aria-label={$t('common.info')}
      size="square-md"
    >
      <Icon src={InformationCircle} size="16" mini />
    </Button>
    <Subscribe {community}>
      {#snippet children({ subscribe, subscribing })}
        {@const subscribed =
          community.subscribed == 'Subscribed' ||
          community.subscribed == 'Pending'}
        <Button
          disabled={subscribing || !profile.current?.jwt}
          loading={subscribing}
          onclick={async () => {
            const object =
              resolveObject &&
              (await client().resolveObject({
                q: community.community.actor_id,
              }))

            const res = object
              ? await subscribe(object.community?.community.id)
              : await subscribe()

            if (res) {
              const newSubscribed =
                res.community_view.subscribed != 'NotSubscribed'
                  ? 'Subscribed'
                  : 'NotSubscribed'

              community.subscribed = newSubscribed
              addSubscription(
                community.community,
                newSubscribed == 'Subscribed',
              )
            }
          }}
          size="custom"
          title={subscribed
            ? $t('cards.community.subscribed')
            : $t('cards.community.subscribe')}
          color={subscribed ? 'secondary' : 'primary'}
          rounding="xl"
          class={[
            subscribed && 'text-slate-600 dark:text-zinc-400',
            ' h-8.5 rounded-full',
            view == 'compact'
              ? 'aspect-square @md:px-2 @md:min-w-30 @md:aspect-auto'
              : 'px-3',
          ]}
          icon={subscribed ? Check : Plus}
        >
          <span class={[view == 'compact' && 'hidden', '@md:block']}>
            {#if subscribed}
              {$t('cards.community.subscribed')}
            {:else}
              {$t('cards.community.subscribe')}
            {/if}
          </span>
        </Button>
      {/snippet}
    </Subscribe>
  {:else}
    {@render children?.()}
  {/if}
</CommonItem>
