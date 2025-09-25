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
    icon?: IconSource | null
    textColor?: string
    type: 'flair' | 'custom'
  }

  export const textToTag: Map<string, Tag> = new Map<string, Tag>([
    ['OC', { content: 'OC', color: '#03A8F240', type: 'custom' }],
    ['NSFL', { content: 'NSFL', color: '#ff000040', type: 'custom' }],
    ['CW', { content: 'CW', color: '#ff000040', type: 'custom' }],
  ])

  export const parseTags = (
    title?: string,
  ): { tags: Tag[]; title?: string } => {
    if (!title) return { tags: [] }

    let extracted: Tag[] = []

    const newTitle = title
      .toString()
      .replace(/^(\[.[^\]]+\])|(\[.[^\]]+\])$/g, (match) => {
        const contents = match.split(',').map((part: string) => part.trim())

        contents
          .map((i) => i.replaceAll(/(\[|\])/g, ''))
          .forEach((content: string) => {
            extracted.push(
              textToTag.get(content) ?? {
                content: content,
                type: 'custom',
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
  import { profile } from '$lib/app/auth.svelte'
  import type { Community, Person, SubscribedType } from '$lib/api/types'
  import UserLink from '$comp/lemmy/user/UserLink.svelte'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { publishedToDate } from '$comp/util/date'
  import RelativeDate, {
    formatRelativeDate,
  } from '$comp/util/RelativeDate.svelte'
  import { t } from '$lib/app/i18n'
  import { settings, type View } from '$lib/settings.svelte'
  import { Badge, Material, modal, Popover } from 'mono-svelte'
  import {
    Bookmark,
    ExclamationTriangle,
    Icon,
    LockClosed,
    Megaphone,
    PaperAirplane,
    Pencil,
    ShieldCheck,
    Tag,
    Trash,
    type IconSource,
  } from 'svelte-hero-icons'
  import { SvelteMap } from 'svelte/reactivity'
  import CommunityLink from '../community/CommunityLink.svelte'

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
    // Badges
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

  const badgeToData: Map<
    BadgeType,
    {
      icon: IconSource
      color: 'red-subtle' | 'yellow-subtle' | 'green-subtle'
      label: string
    }
  > = new SvelteMap([
    [
      'nsfw',
      {
        icon: ExclamationTriangle,
        color: 'red-subtle',
        label: $t('post.badges.nsfw'),
      },
    ],
    [
      'saved',
      {
        icon: Bookmark,
        color: 'yellow-subtle',
        label: $t('post.badges.saved'),
      },
    ],
    [
      'featured',
      {
        icon: Megaphone,
        color: 'green-subtle',
        label: $t('post.badges.featured'),
      },
    ],
    [
      'removed',
      {
        icon: Trash,
        color: 'green-subtle',
        label: $t('post.badges.removed'),
      },
    ],
    [
      'deleted',
      {
        icon: Trash,
        color: 'red-subtle',
        label: $t('post.badges.deleted'),
      },
    ],
    [
      'locked',
      {
        icon: LockClosed,
        color: 'yellow-subtle',
        label: $t('post.badges.locked'),
      },
    ],
  ])
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
    <Popover>
      {#snippet target(attachment)}
        <button
          {@attach attachment}
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
      {#snippet popover(open)}
        {#if open && community && subscribed}
          <Material
            color="uniform"
            rounding="2xl"
            elevation="high"
            class="max-w-2xl w-full max-h-128 overflow-auto"
            data-autoclose="false"
          >
            {#await import('../community/CommunityHeader.svelte') then { default: CommunityHeader }}
              <CommunityHeader {community} {subscribed} />
            {/await}
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
    class="flex flex-row gap-1.5 items-center
     no-list-margin {view == 'compact' && showCommunity ? 'min-sm:mx-2' : ''}"
    style="grid-area: stats;"
  >
    {#if user}
      <address class="contents not-italic">
        {#if view == 'compact' && showCommunity}
          <Icon
            src={PaperAirplane}
            size="12"
            micro
            class="rotate-180 text-slate-400 dark:text-zinc-600 max-sm:hidden"
          />
        {/if}
        <UserLink avatarSize={20} {user} avatar={!showCommunity} class="shrink">
          {#snippet extraBadges()}
            {#if badges.moderator}
              <Icon src={ShieldCheck} size="14" mini class="text-green-500" />
            {/if}
            {#if badges.admin}
              <Icon src={ShieldCheck} size="14" mini class="text-red-500" />
            {/if}
          {/snippet}
        </UserLink>
      </address>
    {/if}
    {#if published}
      <RelativeDate date={published} class="shrink-0" />
    {/if}
    {#if edited}
      <button
        title={$t('post.meta.lastEdited', {
          default: formatRelativeDate(publishedToDate(edited), {
            style: 'long',
          }),
        })}
        onclick={() =>
          modal({
            title: $t('common.info'),
            body: $t('post.meta.lastEdited', {
              default: formatRelativeDate(publishedToDate(edited), {
                style: 'long',
              }),
            }),
          })}
      >
        <Icon src={Pencil} micro size="14" />
      </button>
    {/if}
  </div>
  <div
    class="flex flex-row min-sm:justify-end items-center self-center flex-wrap gap-2 *:shrink-0 badges min-sm:ml-2"
    style="grid-area: badges;"
  >
    {#if tags}
      {#each tags as tag}
        {@const href =
          tag.type == 'flair'
            ? null
            : `/search?community=${community?.id}&q=[${tag.content}]&type=Posts`}
        <svelte:element
          this={href ? 'a' : 'div'}
          {href}
          class="hover:brightness-110"
          style="{tag.color ? `--tag-color: ${tag.color};` : ''} {tag.textColor
            ? `--tag-text-color: ${tag.textColor}`
            : ''}"
        >
          <Badge class={tag.color ? 'badge-tag-color' : ''}>
            {#snippet icon()}
              {#if tag.icon}
                <Icon src={tag.icon} micro size="14" />
              {:else if tag === undefined}
                <Icon src={Tag} micro size="14" />
              {/if}
            {/snippet}
            {tag.content}
          </Badge>
        </svelte:element>
      {/each}
    {/if}
    {#each Object.keys(badges)
      // filter by ones that are true
      .filter((i) => badges[i as BadgeType] == true)
      // get from predetermined map
      .map((i) => badgeToData.get(i as BadgeType))
      // remove null
      .filter((i) => i != undefined) as badge}
      <Badge label={badge.label} color={badge.color} allowIconOnly>
        {#snippet icon()}
          <Icon src={badge.icon} micro size="14" />{/snippet}{badge.label}
      </Badge>
    {/each}
    {@render extraBadges?.()}
  </div>
</header>
{#if title && id}
  {@const useAttachedUrl = settings.posts.titleOpensUrl && postUrl}
  <h3
    class={[
      'font-medium max-sm:mt-0!',
      titleClass,
      settings.markReadPosts && read && 'text-slate-600 dark:text-zinc-400',
      view == 'compact' ? 'text-base' : 'text-lg',
    ]}
    style="grid-area: title;"
  >
    <a
      href={useAttachedUrl
        ? postUrl
        : `/post/${encodeURIComponent(profile.current.instance)}/${id}`}
      target={useAttachedUrl ? '_blank' : undefined}
      rel={useAttachedUrl ? 'noopener noreferrer' : undefined}
      class="inline-block hover:underline hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
    >
      <Markdown
        inline
        source={title}
        class={view != 'compact' ? '' : 'leading-[1.3]'}
      />
    </a>
  </h3>
{:else}
  <div style="grid-area: title; margin: 0;"></div>
{/if}

<style>
  @reference '../../../../app.css';

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

  @media screen and (max-width: 40rem) {
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

  @media screen and (min-width: 40rem) {
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
    background-color: color-mix(
      in oklab,
      #eee,
      var(--tag-color, #fff)
    ) !important;
    color: color-mix(in oklab, #000, var(--tag-text-color, #000)) !important;

    @variant dark {
      background-color: color-mix(
        in oklab,
        #222,
        var(--tag-color, #fff)
      ) !important;
      color: color-mix(
        in oklab,
        #fff 80%,
        var(--tag-text-color, #fff)
      ) !important;
    }
  }
</style>
