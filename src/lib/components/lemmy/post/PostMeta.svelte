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
  import ShieldIcon from '../moderation/ShieldIcon.svelte'
  import { userSettings } from '$lib/settings'

  export let community: Community | undefined = undefined
  export let subscribed: SubscribedType | undefined = undefined

  export let user: Person | undefined = undefined
  export let published: Date | undefined = undefined
  export let title: string | undefined = undefined
  export let id: number | undefined = undefined
  export let read: boolean = false

  // Badges
  export let badges = {
    nsfw: false,
    saved: false,
    featured: false,
    deleted: false,
    removed: false,
    locked: false,
    moderator: false,
    admin: false,
  }
</script>

<div
  class="grid w-full meta {community
    ? 'grid-rows-2'
    : 'grid-rows-1'} text-xs min-w-0 max-w-full"
  style={$$props.style ?? ''}
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
        class="relative cursor-pointer pr-2 row-span-2"
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
    class="text-slate-600 dark:text-zinc-400 flex flex-row gap-2 flex-wrap items-center"
    style="grid-area: stats;"
  >
    {#if user}
      <UserLink avatarSize={20} {user} avatar={!community}>
        <svelte:fragment slot="badges">
          {#if badges.moderator}
            <ShieldIcon filled width={14} class="text-green-500" />
          {/if}
          {#if badges.admin}
            <ShieldIcon filled width={14} class="text-red-500" />
          {/if}
        </svelte:fragment>
      </UserLink>
    {/if}
    {#if published}
      <RelativeDate date={published} />
    {/if}
  </span>

  <div
    class="flex flex-row items-center place-self-end overflow-auto gap-2 [&>*]:flex-shrink-0 mx-2"
    style="grid-area: badges;"
  >
    {#if badges.nsfw}
      <Badge color="red-subtle">NSFW</Badge>
    {/if}
    {#if badges.saved}
      <Badge label="Saved" color="yellow-subtle" allowIconOnly>
        <Icon src={Bookmark} mini size="12" slot="icon" />
        Saved
      </Badge>
    {/if}
    {#if badges.locked}
      <Badge label="Locked" color="yellow-subtle" allowIconOnly>
        <Icon src={LockClosed} mini size="14" slot="icon" />
        <span class="max-md:hidden">Locked</span>
      </Badge>
    {/if}
    {#if badges.removed}
      <Badge label="Removed" color="red-subtle" allowIconOnly>
        <Icon src={Trash} mini size="14" slot="icon" />
        <span class="max-md:hidden">Removed</span>
      </Badge>
    {/if}
    {#if badges.deleted}
      <Badge label="Deleted" color="red-subtle" allowIconOnly>
        <Icon src={Trash} mini size="14" slot="icon" />
        <span class="max-md:hidden">Deleted</span>
      </Badge>
    {/if}
    {#if badges.featured}
      <Badge label="Featured" color="green-subtle" allowIconOnly>
        <Icon src={Megaphone} mini size="14" slot="icon" />
        <span class="max-md:hidden">Featured</span>
      </Badge>
    {/if}
    <slot name="badges" />
  </div>
</div>
{#if title && id}
  <a
    href="/post/{getInstance()}/{id}"
    class="text-lg leading-6 w-full hover:underline hover:text-primary-900 hover:dark:text-primary-100
    transition-colors
    {$userSettings.font == 'satoshi/nunito'
      ? 'font-display font-semibold'
      : 'font-medium'}"
    class:text-slate-600={$userSettings.markReadPosts && read}
    class:dark:text-zinc-400={$userSettings.markReadPosts && read}
    style="grid-area: title;"
  >
    {title}
  </a>
{/if}

<style>
  .meta {
    display: grid;
    grid-template-areas:
      'avatar community badges'
      'avatar stats badges';
    gap: 0;
    grid-template-rows: auto auto;
    grid-template-columns: auto 1fr;
  }
</style>
