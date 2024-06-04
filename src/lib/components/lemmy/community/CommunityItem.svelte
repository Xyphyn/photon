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
  import { isSubscribed } from '$lib/util.js'
  import { profile } from '$lib/auth.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import LabelStat from '$lib/components/ui/LabelStat.svelte'
  import PostBody from '../post/PostBody.svelte'
  import { t } from '$lib/translations'

  export let community: CommunityView

  let showInfo = false
</script>

<Modal title="Community" bind:open={showInfo}>
  <CommunityCard community_view={community} />
</Modal>

<div class="py-4 flex flex-col gap-2 text-sm max-w-full relative">
  <div class="flex flex-row items-center">
    <div class="flex flex-col">
      <CommunityLink
        showInstance={true}
        avatar
        community={community.community}
        class="font-medium text-base"
        instanceClass="text-xs"
      />
    </div>
    <div class="ml-auto flex flex-row items-center gap-2">
      <Button size="square-md" on:click={() => (showInfo = !showInfo)}>
        <Icon src={InformationCircle} size="16" mini />
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
            mini
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
  {#if community.community.description}
    <PostBody body={community.community.description} view="list"></PostBody>
  {/if}
  <div class="flex flex-row gap-3 items-center">
    <LabelStat
      content={community.counts.posts.toString()}
      formatted
      label="Posts"
    />
    <LabelStat
      content={community.counts.subscribers.toString()}
      formatted
      label="Members"
    />
    <LabelStat
      content={community.counts.comments.toString()}
      formatted
      label="Comments"
    />
  </div>
</div>
