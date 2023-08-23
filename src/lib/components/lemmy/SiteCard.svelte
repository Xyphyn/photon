<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { getClient } from '$lib/lemmy.js'
  import type { SiteView, Tagline } from 'lemmy-js-client'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    Newspaper,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'

  export let site: SiteView
  export let taglines: Tagline[] | undefined = undefined
</script>

<StickyCard>
  <div class="flex flex-row gap-3 items-center">
    {#if site.site.icon}
      <Avatar width={42} url={site.site.icon} alt={site.site.name} />
    {/if}
    <div class="flex flex-col">
      <h1 class="font-bold text-base">{site.site.name}</h1>
      <span class="text-sm opacity-60">
        {new URL(site.site.actor_id).hostname}
      </span>
    </div>
  </div>
  <span class="flex flex-row items-center gap-1 text-sm">
    <Icon src={Calendar} width={16} height={16} mini />
    <RelativeDate date={new Date(site.site.published + 'Z')} />
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
  <div class="flex flex-row gap-2 items-center">
    <Button href="/modlog">
      <Icon src={Newspaper} size="16" mini />
      Modlog
    </Button>
  </div>
  {#if taglines && taglines.length > 0}
    <Markdown
      source={taglines[Math.floor(Math.random() * taglines.length)].content}
    />
    <hr class="border-slate-300 dark:border-zinc-700" />
  {/if}
  <Markdown source={site.site.description} />
  <hr class="border-slate-300 dark:border-zinc-700" />
  <Markdown source={site.site.sidebar} />
</StickyCard>
