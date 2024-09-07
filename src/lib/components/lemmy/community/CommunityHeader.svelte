<script lang="ts">
  import { profile } from '$lib/auth'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'

  import { t } from '$lib/translations'
  import { fullCommunityName } from '$lib/util'
  import type {
    Community,
    CommunityAggregates,
    SubscribedType,
  } from 'lemmy-js-client'
  import { Button, toast } from 'mono-svelte'
  import {
    Check,
    Cog6Tooth,
    Icon,
    InformationCircle,
    Plus,
  } from 'svelte-hero-icons'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'

  export let community: Community
  export let subscribed: SubscribedType
  export let counts: CommunityAggregates | undefined = undefined
</script>

<EntityHeader
  banner={community.banner}
  avatar={community.icon}
  name={community.title}
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
      ]
    : []}
  bio={community.description}
>
  <button
    on:click={() => {
      navigator?.clipboard?.writeText?.(
        `!${fullCommunityName(community.name, community.actor_id)}`
      )
      toast({ content: $t('toast.copied') })
    }}
    class="text-sm flex gap-0 items-center"
    slot="nameDetail"
  >
    !{fullCommunityName(community.name, community.actor_id)}
  </button>
  <div class="flex items-center gap-2 h-max">
    {#if $profile?.jwt}
      <Subscribe
        community={{
          community: community,
          banned_from_community: false,
          blocked: false,
          // @ts-ignore
          counts: counts ?? {},
          subscribed: subscribed,
        }}
        let:subscribe
        let:subscribing
      >
        <Button
          disabled={subscribing}
          loading={subscribing}
          size="lg"
          color={subscribed == 'NotSubscribed' ? 'primary' : 'secondary'}
          on:click={async () => {
            subscribed =
              (await subscribe())?.community_view.subscribed ?? 'NotSubscribed'
          }}
          class="flex-1 relative z-[inherit]"
        >
          <Icon
            src={subscribed != 'NotSubscribed' ? Check : Plus}
            micro
            size="16"
            slot="prefix"
          />
          {subscribed == 'Subscribed' || subscribed == 'Pending'
            ? $t('cards.community.subscribed')
            : $t('cards.community.subscribe')}
        </Button>
      </Subscribe>
    {/if}

    <!-- <Button
      size="lg"
      color="secondary"
      class="flex-1"
      on:click={() => (sidebar = !sidebar)}
    >
      <Icon src={InformationCircle} size="16" micro />
      {$t('cards.site.about')}
    </Button> -->
    {#if $profile?.user && $profile.user.moderates
        .map((c) => c.community.id)
        .includes(community.id)}
      <Button
        size="square-lg"
        color="secondary"
        rounding="xl"
        href="/c/{fullCommunityName(
          community.name,
          community.actor_id
        )}/settings"
        style="height: 38px; width: 38px;"
      >
        <Icon src={Cog6Tooth} size="16" mini />
      </Button>
    {/if}
  </div>
</EntityHeader>
