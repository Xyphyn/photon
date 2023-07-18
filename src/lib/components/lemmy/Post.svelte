<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import { isImage } from '$lib/ui/image.js'
  import UserLink from '$lib/components/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { getInstance } from '$lib/lemmy.js'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import PostActions from '$lib/components/lemmy/PostActions.svelte'
  import Badge from '$lib/components/ui/Badge.svelte'
  import {
    Bookmark,
    HandThumbDown,
    Icon,
    InformationCircle,
    Link,
    Trash,
  } from 'svelte-hero-icons'
  import { userSettings } from '$lib/settings.js'

  let postRes: PostView
  export { postRes as post }
</script>

<Card class="bg-white flex flex-col w-full p-5 gap-2.5">
  <span class="flex flex-row gap-2 text-xs items-center">
    <Avatar
      url={postRes.community.icon}
      alt={postRes.community.title}
      width={24}
    />
    <div class="flex flex-col">
      <CommunityLink community={postRes.community} />
      <span class="text-slate-600 dark:text-zinc-400 flex flex-row gap-1">
        <UserLink user={postRes.creator} />
        <span>•</span>
        <RelativeDate date={new Date(postRes.post.published)} />
        <span>•</span>
        <span>
          {Math.floor(
            (postRes.counts.upvotes /
              (postRes.counts.upvotes + postRes.counts.downvotes || 1)) *
              100
          )}%
        </span>
      </span>
    </div>
    <!-- Badges -->
    <div class="flex flex-row ml-auto gap-2">
      {#if postRes.post.nsfw}
        <Badge class="bg-red-600 text-white">NSFW</Badge>
      {/if}
      {#if postRes.counts.score < 0 && postRes.counts.upvotes > 3 && postRes.counts.downvotes > 3}
        <Badge class="bg-purple-400 text-white py-1" label="Controversial">
          <Icon src={HandThumbDown} mini width={16} />
        </Badge>
      {/if}
      {#if postRes.saved}
        <Badge class="bg-yellow-500 text-white py-1" label="Saved">
          <Icon src={Bookmark} mini width={16} />
        </Badge>
      {/if}
      {#if postRes.post.deleted || postRes.post.removed}
        <Badge class="bg-red-600 text-white py-1" label="Deleted">
          <Icon src={Trash} mini width={16} />
        </Badge>
      {/if}
      {#if postRes.post.featured_community || postRes.post.featured_local}
        <Badge class="bg-green-500 text-white py-1" label="Pinned">
          <Icon src={InformationCircle} mini width={16} />
        </Badge>
      {/if}
    </div>
  </span>
  <a
    href="/post/{getInstance()}/{postRes.post.id}"
    class="font-bold"
    class:opacity-50={postRes.read && $userSettings.markReadPosts}
  >
    {postRes.post.name}
  </a>
  {#if postRes.post.url && !postRes.post.thumbnail_url}
    <a
      href={postRes.post.url}
      class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sky-400 hover:underline text-xs"
    >
      {postRes.post.url}
    </a>
  {/if}
  {#if isImage(postRes.post.url)}
    <div class="self-start" class:blur-3xl={postRes.post.nsfw}>
      <picture
        class="rounded-md overflow-hidden max-h-[min(50vh,500px)] w-full max-w-full"
      >
        <source
          srcset="{postRes.post.url}?thumbnail=256&format=webp"
          media="(max-width: 256px)"
        />
        <source
          srcset="{postRes.post.url}?thumbnail=512&format=webp"
          media="(max-width: 512px)"
        />
        <source
          srcset="{postRes.post.url}?thumbnail=720&format=webp"
          media="(max-width: 720px)"
        />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          src="{postRes.post.url}?thumbnail=1024&format=webp"
          loading="lazy"
          class="object-cover bg-slate-100 rounded-md max-h-[50vh] w-full"
          width={512}
          height={300}
        />
      </picture>
    </div>
  {:else if postRes.post.thumbnail_url && postRes.post.url}
    <a
      href={postRes.post.url}
      class="self-start relative group"
      class:blur-3xl={postRes.post.nsfw}
    >
      <img
        src={postRes.post.thumbnail_url}
        alt={postRes.post.name}
        class="rounded-md max-h-[16rem] w-full max-w-full"
      />
      <span
        class="w-full px-4 py-2 overflow-hidden
        whitespace-nowrap text-ellipsis text-sm group-hover:underline bg-slate-100 border
        dark:border-zinc-700
        dark:bg-zinc-800 absolute bottom-0 rounded-b-md flex flex-row gap-1 items-center"
      >
        <Icon src={Link} width={16} mini />
        {new URL(postRes.post.url).hostname}
      </span>
    </a>
  {/if}
  {#if postRes.post.body && !postRes.post.nsfw}
    <p
      class="text-sm max-h-[74px] line-clamp-3 bg-slate-100 dark:bg-zinc-800
        border border-slate-200 dark:border-zinc-700 rounded-md p-2"
    >
      {postRes.post.body}
    </p>
  {/if}
  <PostActions post={postRes} />
</Card>
