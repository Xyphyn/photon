<script lang="ts" module>
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
  import type { Community, Person, SubscribedType } from '$lib/client/types'
  import { Badge, modal, Popover } from 'mono-svelte'
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
  import Material from 'mono-svelte/materials/Material.svelte'

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
    badges?: {
      nsfw: boolean
      saved: boolean
      featured: boolean
      deleted: boolean
      removed: boolean
      locked: boolean
      moderator: boolean
      admin: boolean
    }
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
    class="flex flex-row min-sm:justify-end items-center self-center
    flex-wrap gap-2 *:shrink-0 badges min-sm:ml-2"
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
    {#if badges.nsfw}
      <Badge label={$t('post.badges.nsfw')} color="red-subtle" allowIconOnly>
        {#snippet icon()}
          <Icon src={ExclamationTriangle} size="14" micro />
        {/snippet}
        {$t('post.badges.nsfw')}
      </Badge>
    {/if}
    {#if badges.saved}
      <Badge
        label={$t('post.badges.saved')}
        color="yellow-subtle"
        allowIconOnly
      >
        {#snippet icon()}
          <Icon src={Bookmark} micro size="14" />
        {/snippet}
        {$t('post.badges.saved')}
      </Badge>
    {/if}
    {#if badges.locked}
      <Badge
        label={$t('post.badges.locked')}
        color="yellow-subtle"
        allowIconOnly
      >
        {#snippet icon()}
          <Icon src={LockClosed} micro size="14" />
        {/snippet}
        <span class="max-md:hidden">{$t('post.badges.locked')}</span>
      </Badge>
    {/if}
    {#if badges.removed}
      <Badge label={$t('post.badges.removed')} color="red-subtle" allowIconOnly>
        {#snippet icon()}
          <Icon src={Trash} micro size="14" />
        {/snippet}
        <span class="max-md:hidden">{$t('post.badges.removed')}</span>
      </Badge>
    {/if}
    {#if badges.deleted}
      <Badge label={$t('post.badges.deleted')} color="red-subtle" allowIconOnly>
        {#snippet icon()}
          <Icon src={Trash} micro size="14" />
        {/snippet}
        <span class="max-md:hidden">{$t('post.badges.deleted')}</span>
      </Badge>
    {/if}
    {#if badges.featured}
      <Badge
        label={$t('post.badges.featured')}
        color="green-subtle"
        allowIconOnly
      >
        {#snippet icon()}
          <Icon src={Megaphone} micro size="14" />
        {/snippet}
        <span class="max-md:hidden">{$t('post.badges.featured')}</span>
      </Badge>
    {/if}
    {@render extraBadges?.()}
  </div>
</header>
{#if title && id}
  {@const useAttachedUrl = settings.posts.titleOpensUrl && postUrl}
  <h3
    class={[
      'max-sm:m-0!',
      'font-medium text-balance max-w-xl',
      titleClass,
      settings.markReadPosts && read && 'text-slate-600 dark:text-zinc-400',
      view == 'compact' ? 'text-base' : 'text-lg',
    ]}
    style="grid-area: title;"
  >
    <a
      href={useAttachedUrl
        ? postUrl
        : `/post/${encodeURIComponent(instance.data)}/${id}`}
      target={useAttachedUrl
        ? '_blank'
        : undefined}
      rel={useAttachedUrl ? 'noopener noreferrer' : undefined}
      class="inline-block hover:underline hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
    >
      <Markdown
        source={title}
        inline
        noStyle
        class={view != 'compact' ? '' : 'leading-[1.3]'}
      />
    </a>
  </h3>
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
    background-color: var(--tag-color) !important;
  }
</style>
