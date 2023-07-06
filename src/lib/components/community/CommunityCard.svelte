<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'

  import Card from '$lib/components/ui/Card.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { CommunityView } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'

  export let community_view: CommunityView
</script>

<StickyCard>
  <Avatar
    width={48}
    url={community_view.community.icon ??
      `https://api.dicebear.com/6.x/initials/svg?seed=${community_view.community.name}`}
    alt={community_view.community.name}
  />
  <span class="flex flex-row items-center gap-1 text-sm capitalize">
    <Icon src={Calendar} width={16} height={16} mini />
    <RelativeDate date={new Date(community_view.community.published)} />
  </span>
  <div class="text-sm flex flex-row flex-wrap gap-3">
    <span class="flex flex-row items-center gap-1">
      <Icon src={UserGroup} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.subscribers} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={PencilSquare} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.posts} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
      <FormattedNumber number={community_view.counts.comments} />
    </span>
  </div>
  <h1 class="font-bold text-lg">
    {community_view.community.name}
  </h1>
  <Markdown source={community_view.community.description} />
</StickyCard>
