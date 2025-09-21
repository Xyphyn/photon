<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import { client } from '$lib/client/lemmy.svelte'
  import type { CommunityView } from '$lib/client/types'
  import CommonItem from '$lib/components/ui/layout/CommonItem.svelte'
  import { locale, t } from '$lib/i18n/translations'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { fullCommunityName } from '$lib/util.svelte.js'
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
  } from 'svelte-hero-icons'
  import { SvelteURL } from 'svelte/reactivity'
  import { CommunityCard } from '.'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'

  interface Props {
    community: CommunityView
    view?: 'cozy' | 'compact'
    showCounts?: boolean
    children?: Snippet
    resolveObject?: boolean
  }

  let {
    community = $bindable(),
    view = 'compact',
    showCounts = true,
    resolveObject,
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
  {#if community.community.deleted}
    <Icon
      src={Trash}
      class="text-red-500 inline"
      micro
      size="14"
      title={$t('post.badges.deleted')}
    />
  {/if}
  {#if community.community.nsfw}
    <Icon
      src={ExclamationTriangle}
      class="text-red-500 inline"
      micro
      size="14"
      title={$t('post.badges.nsfw')}
    />
  {/if}
  {#if community.banned_from_community}
    <Icon
      src={NoSymbol}
      class="text-red-500 inline"
      micro
      size="14"
      title={$t('comment.banned')}
    />
  {/if}
  {#if community.community.visibility == 'LocalOnly'}
    <Icon
      src={MapPin}
      class="text-green-500 inline"
      micro
      size="14"
      title={$t('routes.admin.config.listingType.local')}
    />
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
            addSubscription(community.community, newSubscribed == 'Subscribed')
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
</CommonItem>
