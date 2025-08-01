<script lang="ts" module>
  type BadgeType =
    | 'nsfw'
    | 'saved'
    | 'featured'
    | 'deleted'
    | 'removed'
    | 'locked'
    | 'moderator'
    | 'admin'

  export interface Tag {
    content: string
    color?: string
    icon?: IconSource
  }

  export const textToTag: Map<string, Tag> = new Map<string, Tag>([
    ['OC', { content: 'OC', color: '#03A8F240' }],
    ['NSFL', { content: 'NSFL', color: '#ff000040' }],
    ['CW', { content: 'CW', color: '#ff000040' }],
  ])

  export const parseTags = (
    title?: string,
  ): { tags: Tag[]; title?: string } => {
    if (!title) return { tags: [] }

    let extracted: Tag[] = []

    const newTitle = title
      .toString()
      .replace(/^(\[.[^\]]+\])|(\[.[^\]]+\])$/g, match => {
        const contents = match.split(',').map((part: string) => part.trim())

        contents
          .map(i => i.replaceAll(/(\[|\])/g, ''))
          .forEach((content: string) => {
            extracted.push(
              textToTag.get(content) ?? {
                content: content,
              },
            )
          })
        return ''
      })

    return {
      tags: extracted,
      title: newTitle,
    }
  }
</script>

<script lang="ts">
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { publishedToDate } from '$lib/components/util/date'
  import RelativeDate, {
    formatRelativeDate,
  } from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations'
  import { instance } from '$lib/instance.svelte'
  import { settings, type View } from '$lib/settings.svelte'
  import type { Community, Person, SubscribedType } from 'lemmy-js-client'
  import { Badge, Popover } from 'mono-svelte'
  import Material from 'mono-svelte/materials/Material.svelte'
  import {
    Bookmark,
    ExclamationTriangle,
    Icon,
    Megaphone,
    PaperAirplane,
    Pencil,
    Tag,
    Trash,
    type IconSource,
  } from 'svelte-hero-icons'
  import CommunityHeader from '../community/CommunityHeader.svelte'
  import ShieldIcon from '../moderation/ShieldIcon.svelte'

  const badgeToData: Map<
    BadgeType,
    {
      icon: IconSource
      color: 'red-subtle' | 'yellow-subtle' | 'green-subtle'
      label: string
    }
  > = new Map([
    [
      'nsfw',
      {
        icon: ExclamationTriangle,
        color: 'red-subtle',
        label: t.get('post.badges.nsfw'),
      },
    ],
    [
      'saved',
      {
        icon: Bookmark,
        color: 'yellow-subtle',
        label: t.get('post.badges.saved'),
      },
    ],
    [
      'featured',
      {
        icon: Megaphone,
        color: 'green-subtle',
        label: t.get('post.badges.featured'),
      },
    ],
    [
      'removed',
      {
        icon: Trash,
        color: 'green-subtle',
        label: t.get('post.badges.removed'),
      },
    ],
    [
      'deleted',
      {
        icon: Trash,
        color: 'red-subtle',
        label: t.get('post.badges.deleted'),
      },
    ],
    [
      'locked',
      {
        icon: Lock,
        color: 'yellow-subtle',
        label: t.get('post.badges.locked'),
      },
    ],
  ])

  interface Props {
    community?: Community
    showCommunity?: boolean
    subscribed?: SubscribedType
    user?: Person
    published?: Date
    title?: string
    id?: number
    read?: boolean
    edited?: string
    view?: View
    badges?: Record<BadgeType, boolean>
    tags?: Tag[]
    style?: string
    titleClass?: string
    extraBadges?: import('svelte').Snippet
    postUrl?: string
  }

  let {
    community = $bindable(undefined),
    showCommunity = true,
    subscribed = $bindable(undefined),
    user,
    published,
    title,
    id,
    read = false,
    edited,
    view = 'cozy',
    badges = {
      nsfw: false,
      saved: false,
      featured: false,
      deleted: false,
      removed: false,
      locked: false,
      moderator: false,
      admin: false,
    },
    tags = [],
    postUrl,
    style = '',
    titleClass = '',
    extraBadges,
  }: Props = $props()
</script>

<!-- 
  @component
  This component will build two different things: a post's meta block and the title.
-->
<header
  class={[
    'grid w-full meta',
    community ? 'grid-rows-2' : 'grid-rows-1 minimal',
    'text-xs min-w-0 max-w-full text-slate-600 dark:text-zinc-400',
  ]}
  class:compact={view == 'compact'}
  {style}
>
  {#if showCommunity && community}
    <Popover autoClose={false} popoverClass="backdrop-blur-xl rounded-2xl">
      {#snippet target()}
        <button
          class={[
            'row-span-2 shrink-0 mr-2 self-center group/btn',
            'bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer',
          ]}
        >
          {#if community.nsfw && settings.nsfwBlur}
            <div
              style="width: {view == 'compact' ? 24 : 32}; height: {view ==
              'compact'
                ? 24
                : 32}"
              class="bg-red-400 rounded-xl"
            ></div>
          {:else}
            <Avatar
              url={community?.icon}
              width={view == 'compact' ? 24 : 32}
              alt={community?.name}
              circle={false}
              class="group-hover/btn:scale-90 group-active/btn:scale-[.85] transition-transform"
            />
          {/if}
        </button>
      {/snippet}
      {#snippet popover()}
        {#if community && subscribed}
          <Material
            color="uniform"
            rounding="2xl"
            elevation="high"
            class="max-w-2xl w-full max-h-128 overflow-auto"
          >
            <CommunityHeader {community} {subscribed} />
          </Material>
        {/if}
      {/snippet}
    </Popover>
  {/if}
  {#if showCommunity && community}
    <CommunityLink
      {community}
      style="grid-area: community;"
      class="shrink no-list-margin"
      badges={{
        nsfw: community.nsfw,
      }}
    />
  {/if}
  <div
    class="flex flex-row gap-1.5 items-center no-list-margin"
    style="grid-area: stats;"
  >
    {#if user}
      <address class="contents not-italic">
        {#if view == 'compact' && showCommunity}
          <Icon
            src={PaperAirplane}
            size="12"
            micro
            class="rotate-180 text-slate-400 dark:text-zinc-600 max-[480px]:hidden ml-2"
          />
        {/if}
        <UserLink
          avatarSize={20}
          {user}
          avatar={!showCommunity}
          class="shrink "
        >
          {#snippet extraBadges()}
            {#if badges.moderator}
              <ShieldIcon filled width={14} class="text-green-500" />
            {/if}
            {#if badges.admin}
              <ShieldIcon filled width={14} class="text-red-500" />
            {/if}
          {/snippet}
        </UserLink>
      </address>
    {/if}
    {#if published}
      <RelativeDate date={published} class="shrink-0" />
    {/if}
    {#if edited}
      <div
        title={$t('post.meta.lastEdited', {
          default: formatRelativeDate(publishedToDate(edited), {
            style: 'long',
          }),
        })}
      >
        <Icon src={Pencil} micro size="14" />
      </div>
    {/if}
  </div>
  <div
    class="flex flex-row min-[480px]:justify-end items-center self-center
    flex-wrap gap-2 *:shrink-0 badges min-[480px]:ml-2"
    style="grid-area: badges;"
  >
    {#if tags}
      {#each tags as tag}
        <a
          class="hover:brightness-110"
          href="/search?community={community?.id}&q=[{tag.content}]&type=Posts"
          style={tag.color ? `--tag-color: ${tag.color};` : ''}
        >
          <Badge class={tag.color ? 'badge-tag-color' : ''}>
            {#snippet icon()}
              {#if tag.icon}
                <Icon src={tag.icon} micro size="14" />
              {:else}
                <Icon src={Tag} micro size="14" />
              {/if}
            {/snippet}
            {tag.content}
          </Badge>
        </a>
      {/each}
    {/if}
    {#each Object.keys(badges)
      // filter by ones that are true
      .filter(i => badges[i as BadgeType] == true)
      // get from predetermined map
      .map(i => badgeToData.get(i as BadgeType))
      // remove null
      .filter(i => i != undefined) as badge}
      <Badge label={badge.label} color={badge.color} allowIconOnly>
        {#snippet icon()}
          <Icon src={badge.icon} micro size="14" />
        {/snippet}
        {badge.label}
      </Badge>
    {/each}
    {@render extraBadges?.()}
  </div>
</header>
{#if title && id}
  <a
    href={settings.posts.titleOpensUrl && postUrl
      ? postUrl
      : `/post/${encodeURIComponent(instance.data)}/${id}`}
    target={settings.posts.titleOpensUrl || settings.openLinksInNewTab
      ? '_blank'
      : undefined}
    class={[
      'inline max-[480px]:mt-0!',
      'hover:underline hover:text-primary-900 dark:hover:text-primary-100 transition-colors',
      'font-medium',
      titleClass,
      settings.markReadPosts && read && 'text-slate-600 dark:text-zinc-400',
      view == 'compact' ? 'text-base' : 'text-lg',
    ]}
    style="grid-area: title;"
    data-sveltekit-preload-data="tap"
  >
    {#if title}
      <Markdown
        source={title}
        inline
        noStyle
        class={view == 'compact' ? '' : 'leading-[1.3]'}
      ></Markdown>
    {/if}
  </a>
{:else}
  <div style="grid-area: title; margin: 0;"></div>
{/if}

<style>
  .meta {
    display: grid;
    grid-template-areas:
      'avatar community badges'
      'avatar stats badges';
    gap: 0;
    grid-template-rows: auto auto auto;
    grid-template-columns: 40px minmax(0, auto);
  }

  .meta.minimal {
    grid-template-columns: 0fr;
  }

  @media screen and (max-width: 480px) {
    .meta.compact {
      grid-template-areas:
        'avatar community'
        'avatar stats'
        'badges badges';
      gap: 0;
      grid-template-columns: 32px minmax(0, auto);
    }
    .meta.minimal {
      grid-template-columns: 0fr;
    }
  }

  @media screen and (min-width: 480px) {
    .meta.compact {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .meta.minimal {
      grid-template-columns: 0fr;
    }
  }

  :global(.badge-tag-color) {
    background-color: var(--tag-color) !important;
  }
</style>
