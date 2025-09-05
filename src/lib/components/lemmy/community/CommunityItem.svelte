<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import LabelStat from '$lib/components/ui/LabelStat.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/lemmy.svelte'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { settings } from '$lib/settings.svelte'
  import { fullCommunityName, isSubscribed } from '$lib/util.svelte.js'
  import type { CommunityView } from 'lemmy-js-client'
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
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'

  interface Props {
    community: CommunityView
    view?: 'cozy' | 'compact'
    showCounts?: boolean
    class?: string
    icon?: import('svelte').Snippet
    children?: Snippet
    resolveObject?: boolean
    actions?: boolean
  }

  let {
    community = $bindable(),
    view = 'compact',
    showCounts = true,
    class: clazz = 'flex flex-col gap-4 text-sm max-w-full relative',
    icon,
    children,
    resolveObject,
    actions = true,
  }: Props = $props()
</script>

{#snippet communityInfo()}
  <CommunityCard community_view={community} />
{/snippet}

<div class={clazz}>
  <div
    class={[
      view == 'cozy' ? 'flex-col gap-2' : 'flex-row',
      'flex max-w-full w-full',
    ]}
  >
    <a
      href="/c/{fullCommunityName(
        community.community.name,
        community.community.actor_id,
      )}"
      class="flex-1 w-full overflow-hidden group"
      data-sveltekit-preload-data="tap"
    >
      <div class="flex flex-row gap-2 items-center">
        {#if icon}
          {@render icon()}
        {:else if community.community.nsfw && settings.nsfwBlur}
          <div class="w-8 h-8 rounded-xl bg-red-400"></div>
        {:else}
          <Avatar
            url={community.community.icon}
            width={32}
            circle={false}
            alt={community.community.name}
            class={[
              community.community.nsfw && settings.nsfwBlur && 'blur-3xl',
            ]}
          />
        {/if}
        <div
          class="flex flex-col overflow-hidden whitespace-nowrap flex-1 min-w-0 shrink"
        >
          <div
            class="font-medium text-base overflow-hidden text-ellipsis leading-5"
          >
            <h3 class="group-hover:underline text-left">
              {community.community.title}
            </h3>
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
          </div>
          <div class="text-sm text-slate-500 dark:text-zinc-500 flex gap-0.5">
            <span class="overflow-hidden text-ellipsis">
              {new URL(community.community.actor_id).hostname}
            </span>
            <span class="overflow-hidden text-ellipsis">
              {#if !showCounts}
                •
                <FormattedNumber number={community.counts.subscribers} />
              {/if}
            </span>
          </div>
        </div>
      </div>
    </a>
    {#if children || !actions}
      {@render children?.()}
    {:else}
      <div class="flex flex-row items-center gap-2">
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
            {@const subscribed = isSubscribed(community.subscribed)}
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
            >
              {#snippet prefix()}
                <Icon src={subscribed ? Check : Plus} size="16" micro />
              {/snippet}
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
      </div>
    {/if}
  </div>
  {#if showCounts}
    <div class="flex flex-row gap-3 items-center justify-center">
      {#if community.counts.posts}
        <LabelStat
          content={community.counts.posts.toString()}
          formatted
          label="Posts"
        />
      {/if}
      {#if community.counts.subscribers}
        <LabelStat
          content={community.counts.subscribers.toString()}
          formatted
          label="Members"
        />
      {/if}
      {#if community.counts.comments}
        <LabelStat
          content={community.counts.comments.toString()}
          formatted
          label="Comments"
        />
      {/if}
    </div>
  {/if}
</div>
