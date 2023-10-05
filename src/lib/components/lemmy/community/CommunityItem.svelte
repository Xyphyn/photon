<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import type { CommunityView } from 'lemmy-js-client'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'
  import {
    ChatBubbleOvalLeftEllipsis,
    Check,
    Icon,
    PencilSquare,
    Plus,
    UserGroup,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import { Button } from 'mono-svelte'
  import { isSubscribed } from '$lib/util.js'
  import { profile } from '$lib/auth.js'
  import { addSubscription } from '$lib/lemmy/user.js'

  export let community: CommunityView
</script>

<div class="py-4 flex flex-col gap-1 text-sm max-w-full">
  <div class="flex flex-row items-center">
    <span
      class="break-words max-w-full w-max text-base font-bold hover:underline"
    >
      <CommunityLink
        showInstance={false}
        avatar
        community={community.community}
      />
    </span>
    <div class="ml-auto">
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
            Subscribed
          {:else}
            Subscribe
          {/if}
        </Button>
      </Subscribe>
    </div>
  </div>
  <span class="opacity-80 mb-2">
    {new URL(community.community.actor_id).hostname}
  </span>
  <div class="flex flex-row gap-3 items-center">
    <div class="flex flex-row gap-1 items-center">
      <Icon src={UserGroup} width={16} mini />
      <FormattedNumber number={community.counts.subscribers} />
    </div>
    <div class="flex flex-row gap-1 items-center">
      <Icon src={PencilSquare} mini width={16} />
      <FormattedNumber number={community.counts.posts} />
    </div>
    <div class="flex flex-row gap-1 items-center">
      <Icon src={ChatBubbleOvalLeftEllipsis} mini width={16} />
      <FormattedNumber number={community.counts.comments} />
    </div>
  </div>
</div>
