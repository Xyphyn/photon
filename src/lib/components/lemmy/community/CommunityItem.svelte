<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import type { CommunityView } from 'lemmy-js-client'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'
  import {
    ChatBubbleOvalLeftEllipsis,
    Check,
    Icon,
    InformationCircle,
    PencilSquare,
    Plus,
    UserGroup,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button, Modal } from 'mono-svelte'
  import { fullCommunityName, isSubscribed } from '$lib/util.js'
  import { profile } from '$lib/auth.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import LabelStat from '$lib/components/ui/LabelStat.svelte'
  import PostBody from '../post/PostBody.svelte'
  import { t } from '$lib/translations'
  import Entity from '$lib/components/ui/Entity.svelte'

  export let community: CommunityView

  let showInfo = false
</script>

{#if showInfo}
  <Modal title={$t('routes.community.title')} bind:open={showInfo}>
    <CommunityCard community_view={community} />
  </Modal>
{/if}

<div class="py-4 flex flex-col gap-2 text-sm max-w-full relative">
  <div class="flex flex-row items-center max-w-full w-full">
    <a
      href="/c/{fullCommunityName(
        community.community.name,
        community.community.actor_id
      )}"
      class="hover:underline"
    >
      <Entity
        icon={community.community.icon}
        label={new URL(community.community.actor_id).hostname}
        name={community.community.title}
      ></Entity>
    </a>
    <div class="ml-auto flex flex-row items-center gap-2">
      <Button size="square-md" on:click={() => (showInfo = !showInfo)}>
        <Icon src={InformationCircle} size="16" micro />
      </Button>
      <Subscribe {community} let:subscribe let:subscribing>
        <Button
          disabled={subscribing || !$profile?.jwt}
          loading={subscribing}
          on:click={async () => {
            const res = await subscribe()

            if (res) {
              const newSubscribed =
                res.community_view.subscribed != 'NotSubscribed'
                  ? 'Subscribed'
                  : 'NotSubscribed'

              community.subscribed = newSubscribed
              addSubscription(
                community.community,
                newSubscribed == 'Subscribed'
              )
            }
          }}
          color={isSubscribed(community.subscribed) ? 'elevatedLow' : 'primary'}
          class={isSubscribed(community.subscribed)
            ? 'text-slate-600 dark:text-zinc-400'
            : ''}
        >
          <Icon
            src={isSubscribed(community.subscribed) ? Check : Plus}
            size="16"
            micro
            slot="prefix"
          />
          {#if isSubscribed(community.subscribed)}
            {$t('cards.community.subscribed')}
          {:else}
            {$t('cards.community.subscribe')}
          {/if}
        </Button>
      </Subscribe>
    </div>
  </div>
  {#if community.counts}
    <div class="flex flex-row gap-3 items-center">
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
