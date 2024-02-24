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

  // Badges
  export let nsfw: boolean = false
  export let saved: boolean = false
  export let featured: boolean = false
  export let deleted: boolean = false
  export let removed: boolean = false
  export let locked: boolean = false
</script>

<div
  class="grid w-full meta {community ? 'grid-rows-2' : 'grid-rows-1'} text-xs"
>
  {#if community}
    <Subscribe let:subscribe let:subscribing>
      <button
        on:click={async () => {
          if (!community) return
          await subscribe(community.id, subscribed)
          subscribed =
            subscribed == 'NotSubscribed' ? 'Subscribed' : 'NotSubscribed'
        }}
        class="relative cursor-pointer row-span-2 pr-2"
      >
        <Avatar
          url={community.icon}
          width={28}
          alt={community.name}
          style="grid-area: avatar; height: 100%;"
        />
        {#if subscribed != undefined && $profile?.jwt}
          <div
            class="absolute w-3.5 h-3.5 {subscribed == 'NotSubscribed'
              ? 'bg-primary-900 dark:bg-primary-100 text-white dark:text-black'
              : 'bg-primary-100 dark:bg-primary-900 text-black dark:text-white'} rounded-full ring-2 box-border
            ring-slate-50 dark:ring-zinc-950
            -bottom-1 right-1 grid place-items-center transition-all"
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
  {#if community}
    <CommunityLink {community} style="grid-area: community;" />
  {/if}
  <span
    class="text-slate-600 dark:text-zinc-400 flex flex-row gap-2 flex-wrap items-center row-span-2"
    style="grid-area: stats;"
  >
    {#if user}
      <UserLink avatarSize={20} {user} avatar={!community} />
    {/if}
    {#if published}
      <RelativeDate date={published} />
    {/if}
  </span>

  <div
    class="flex flex-row items-center place-self-end overflow-auto [&>*]:flex-shrink-0"
    style="grid-area: badges;"
  >
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
      <Badge label="Removed" color="red-subtle">
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
      <Badge label="Featured" color="green-subtle">
        <Icon src={Megaphone} mini size="14" />
        <span class="max-md:hidden">Featured</span>
      </Badge>
    {/if}
    <slot name="badges" />
  </div>
  {#if title && id}
    <a href="/post/{getInstance()}/{id}" class="font-medium">
      {title}
    </a>
  {/if}
</div>

<style>
  .meta {
    display: grid;
    grid-template-areas:
      'avatar community badges'
      'avatar stats badges';
    gap: 0;
    grid-template-columns: max-content;
  }
</style>
