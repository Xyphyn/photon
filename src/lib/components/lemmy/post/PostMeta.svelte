<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Badge from '$lib/components/ui/Badge.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { Community, Person } from 'lemmy-js-client'
  import {
    Bookmark,
    Icon,
    InformationCircle,
    LockClosed,
    Trash,
  } from 'svelte-hero-icons'

  export let community: Community | undefined = undefined
  export let user: Person | undefined = undefined
  export let published: Date

  // Score
  export let upvotes: number | undefined = undefined
  export let downvotes: number | undefined = undefined

  // Badges
  export let nsfw: boolean
  export let saved: boolean
  export let featured: boolean
  export let deleted: boolean
  export let removed: boolean = false
  export let locked: boolean = false
</script>

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
        <div class="mr-0.5 text-zinc-100">
          <UserLink avatarSize={20} {user} avatar={!community} />
        </div>
      {/if}
      <RelativeDate date={published} />
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
      <Badge class="bg-red-600 text-white">NSFW</Badge>
    {/if}
    {#if saved}
      <Badge class="bg-yellow-500 text-white py-1" label="Saved">
        <Icon src={Bookmark} mini width={16} />
      </Badge>
    {/if}
    {#if locked}
      <Badge class="bg-yellow-400 text-black py-1" label="Locked">
        <Icon src={LockClosed} mini width={16} />
      </Badge>
    {/if}
    {#if removed}
      <Badge class="bg-green-600 text-white py-1" label="Removed">
        <Icon src={Trash} mini width={16} />
      </Badge>
    {/if}
    {#if deleted}
      <Badge class="bg-red-600 text-white py-1" label="Deleted">
        <Icon src={Trash} mini width={16} />
      </Badge>
    {/if}
    {#if featured}
      <Badge class="bg-green-500 text-white py-1" label="Pinned">
        <Icon src={InformationCircle} mini width={16} />
      </Badge>
    {/if}
  </div>
</span>
