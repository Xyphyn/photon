<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import type { CommunityView } from 'lemmy-js-client'
  import Subscribe from '../../../../routes/(app)/communities/Subscribe.svelte'
  import {
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'

  export let community: CommunityView
</script>

<div
  class="py-4 border-b border-black/20 dark:border-white/20
  flex flex-col gap-1 text-sm max-w-full"
>
  <div class="flex flex-row items-center">
    <span
      class="break-words max-w-full w-max text-base font-bold text-sky-400 hover:underline"
    >
      <CommunityLink avatar community={community.community} />
    </span>
    <div class="ml-auto">
      <Subscribe {community} let:subscribe let:subscribing>
        <Button
          disabled={subscribing}
          loading={subscribing}
          on:click={async () => {
            const res = await subscribe()

            if (res) {
              community.subscribed =
                res.community_view.subscribed != 'NotSubscribed'
                  ? 'Subscribed'
                  : 'NotSubscribed'
            }
          }}
          color={community.subscribed == 'Subscribed' ? 'primary' : 'ghost'}
        >
          {community.subscribed == 'Subscribed' ? 'Subscribed' : 'Subscribe'}
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
      <span>
        {Intl.NumberFormat('en', { notation: 'compact' }).format(
          community.counts.subscribers
        )}
      </span>
    </div>
    <div class="flex flex-row gap-1 items-center">
      <Icon src={PencilSquare} mini width={16} />
      <span>
        {Intl.NumberFormat('en', { notation: 'compact' }).format(
          community.counts.posts
        )}
      </span>
    </div>
    <div class="flex flex-row gap-1 items-center">
      <Icon src={ChatBubbleOvalLeftEllipsis} mini width={16} />
      <FormattedNumber number={community.counts.comments} />
    </div>
  </div>
</div>
