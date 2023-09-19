<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { Badge } from 'mono-svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import type { Community, Person, SubscribedType } from 'lemmy-js-client'
  import {
    Bookmark,
    Check,
    Icon,
    LockClosed,
    Megaphone,
    Plus,
    Trash,
  } from 'svelte-hero-icons'
  import { getInstance } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import Subscribe from '../../../../routes/communities/Subscribe.svelte'

  export let community: Community | undefined = undefined
  export let subscribed: SubscribedType | undefined = undefined

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
      <Subscribe let:subscribe let:subscribing>
        <button
          on:click={async () => {
            if (!community) return
            await subscribe(community.id, subscribed)
            subscribed =
              subscribed == 'NotSubscribed' ? 'Subscribed' : 'NotSubscribed'
          }}
          class="relative cursor-pointer"
        >
          <Avatar url={community.icon} width={28} alt={community.name} />
          {#if subscribed != undefined && $profile?.jwt}
            <div
              class="absolute w-3.5 h-3.5 {subscribed == 'NotSubscribed'
                ? 'bg-primary-900 dark:bg-primary-100 text-white dark:text-black'
                : 'bg-primary-100 dark:bg-primary-900 text-black dark:text-white'} rounded-full ring-2 box-border
            ring-slate-50 dark:ring-zinc-950
            -bottom-1.5 -right-1.5 grid place-items-center transition-all"
            >
              <Icon
                src={subscribed == 'NotSubscribed' ? Plus : Check}
                mini
                size="12"
              />
            </div>
          {/if}
        </button>
      </Subscribe>
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
