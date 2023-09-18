<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { Badge } from 'mono-svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { Community, Person } from 'lemmy-js-client'
  import {
    Bookmark,
    Icon,
    LockClosed,
    Megaphone,
    Trash,
  } from 'svelte-hero-icons'
  import { getInstance } from '$lib/lemmy.js'

  export let community: Community | undefined = undefined
  export let user: Person | undefined = undefined
  export let published: Date | undefined = undefined
  export let title: string | undefined = undefined
  export let id: number | undefined = undefined

  // Score
  export let upvotes: number | undefined = undefined
  export let downvotes: number | undefined = undefined

  // Badges
  export let nsfw: boolean = false
  export let saved: boolean = false
  export let featured: boolean = false
  export let deleted: boolean = false
  export let removed: boolean = false
  export let locked: boolean = false
</script>

<div class="flex flex-col gap-1 w-full">
  <span class="flex flex-row gap-2 text-sm items-center">
    {#if community}
      <Avatar url={community.icon} width={24} alt={community.name} />
    {/if}
    <div class="flex flex-col text-xs">
      {#if community}
        <CommunityLink {community} />
      {/if}
      <span
        class="text-slate-600 dark:text-zinc-400 flex flex-row gap-1 flex-wrap items-center"
      >
        {#if user}
          <div
            class="mr-0.5 flex items-center"
            class:text-slate-900={!community}
            class:dark:text-zinc-100={!community}
          >
            <UserLink avatarSize={20} {user} avatar={!community} />
          </div>
        {/if}
        {#if published}
          <RelativeDate date={published} />
        {/if}
        {#if upvotes != undefined && downvotes != undefined}
          <span>•</span>
          <span>
            {Math.floor((upvotes / (upvotes + downvotes || 1)) * 100)}%
          </span>
        {/if}
      </span>
    </div>

    <div class="flex flex-row ml-auto gap-2 flex-wrap">
      {#if nsfw}
        <Badge color="red-subtle">NSFW</Badge>
      {/if}
      {#if saved}
        <Badge label="Saved" color="yellow-subtle">
          <Icon src={Bookmark} mini size="12" />
          <span class="max-md:hidden">Saved</span>
        </Badge>
      {/if}
      {#if locked}
        <Badge label="Locked" color="yellow-subtle">
          <Icon src={LockClosed} mini size="14" />
          <span class="max-md:hidden">Locked</span>
        </Badge>
      {/if}
      {#if removed}
        <Badge label="Removed" color="red">
          <Icon src={Trash} mini size="14" />
          <span class="max-md:hidden">Removed</span>
        </Badge>
      {/if}
      {#if deleted}
        <Badge label="Deleted" color="red-subtle">
          <Icon src={Trash} mini size="14" />
          <span class="max-md:hidden">Deleted</span>
        </Badge>
      {/if}
      {#if featured}
        <Badge label="Featured" color="green">
          <Icon src={Megaphone} mini size="14" />
          <span class="max-md:hidden">Featured</span>
        </Badge>
      {/if}
    </div>
  </span>
  {#if title && id}
    <a href="/post/{getInstance()}/{id}" class="font-medium">
      {title}
    </a>
  {/if}
</div>
