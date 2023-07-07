<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { SiteView } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    Newspaper,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'

  export let site: SiteView
</script>

<StickyCard>
  <!-- {#if site.site.icon} -->
  <!-- <Avatar width={64} url={site.site.icon} alt={site.site.name} /> -->
  <!-- {/if} -->
  <span class="flex flex-row items-center gap-1 text-sm">
    <Icon src={Calendar} width={16} height={16} mini />
    <RelativeDate date={new Date(site.site.published)} />
  </span>
  <div class="text-sm flex flex-row flex-wrap gap-3">
    <span class="flex flex-row items-center gap-1">
      <Icon src={UserGroup} width={16} height={16} mini />
      <FormattedNumber number={site.counts.users} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={PencilSquare} width={16} height={16} mini />
      <FormattedNumber number={site.counts.posts} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
      <FormattedNumber number={site.counts.comments} />
    </span>
    <span class="flex flex-row items-center gap-1">
      <Icon src={Newspaper} width={16} height={16} mini />
      <FormattedNumber number={site.counts.communities} />
    </span>
  </div>
  <div>
    <h1 class="font-bold text-lg">{site.site.name}</h1>
  </div>
  <Markdown source={site.site.description} />
</StickyCard>
