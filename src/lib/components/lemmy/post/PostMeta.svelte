<script lang="ts">
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Badge from '$lib/components/ui/Badge.svelte'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { Community, Person } from 'lemmy-js-client'
  import { Bookmark, Icon, InformationCircle, Trash } from 'svelte-hero-icons'

  export let community: Community
  export let user: Person
  export let published: Date

  // Score
  export let upvotes: number
  export let downvotes: number

  // Badges
  export let nsfw: boolean
  export let saved: boolean
  export let featured: boolean
  export let deleted: boolean
</script>

<span class="flex flex-row gap-2 text-sm items-center">
  <Avatar url={community.icon} width={24} alt={community.name} />
  <div class="flex flex-col text-xs">
    <CommunityLink {community} />
    <span class="text-slate-600 dark:text-zinc-400 flex flex-row gap-1">
      <UserLink {user} />
      <span>•</span>
      <RelativeDate date={published} />
      <span>•</span>
      <span>
        {Math.floor((upvotes / (upvotes + downvotes || 1)) * 100)}%
      </span>
    </span>
  </div>

  <div class="flex flex-row ml-auto gap-2">
    {#if nsfw}
      <Badge class="bg-red-600 text-white">NSFW</Badge>
    {/if}
    {#if saved}
      <Badge class="bg-yellow-500 text-white py-1" label="Saved">
        <Icon src={Bookmark} mini width={16} />
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