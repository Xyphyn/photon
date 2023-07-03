<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import Avatar from '../../post/[id]/Avatar.svelte'
  import Post from '../../post/[id]/Post.svelte'
  import { goto } from '$app/navigation'
  import RelativeDate from '$lib/components/RelativeDate.svelte'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    Newspaper,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/FormattedNumber.svelte'
  import Card from '$lib/components/Card.svelte'

  export let data
</script>

<div class="flex flex-row gap-4 justify-between">
  <div class="flex flex-col gap-4 max-w-full">
    <div class="flex flex-col sm:flex-row gap-4 max-w-full">
      <MultiSelect
        options={['Active', 'TopWeek', 'TopAll', 'New']}
        optionNames={['Active', 'Top (Week)', 'Top (All)', 'New']}
        selected={$page.url.searchParams.get('sort') ?? 'Active'}
        on:select={(e) => {
          const url = $page.url
          url.searchParams.set('sort', e.detail)
          url.searchParams.delete('page')
          goto(url, {
            invalidateAll: true,
          })
        }}
      />
    </div>
    {#each data.posts.posts as post}
      <Post {post} />
    {/each}
    <div>
      <Link
        href={(function () {
          $page.url.searchParams.set(
            'page',
            ((Number($page.url.searchParams.get('page')) || 1) + 1).toString()
          )

          return $page.url.toString()
        })()}
      >
        Next
      </Link>
    </div>
  </div>
  <Card>
    {#await data.streamed.community}
      <div
        class="w-[64px] h-[64px] rounded-full bg-slate-200
  dark:bg-zinc-700 animate-pulse"
      />
      <div
        class="w-32 h-3 bg-slate-200 dark:bg-zinc-700 animate-pulse
  rounded-md"
      />
      <div
        class="w-64 h-3 bg-slate-200 dark:bg-zinc-700 animate-pulse
  rounded-md"
      />
      <div
        class="w-36 h-4 bg-slate-200 dark:bg-zinc-700 animate-pulse
  rounded-md"
      />
      <div
        class="w-full h-4 bg-slate-200 dark:bg-zinc-700 animate-pulse
  rounded-md"
      />
      <div
        class="w-24 h-4 bg-slate-200 dark:bg-zinc-700 animate-pulse
  rounded-md"
      />
    {:then community}
      <Avatar
        width={48}
        url={community.community_view.community.icon ??
          `https://api.dicebear.com/6.x/initials/svg?seed=${community.community_view.community.name}`}
        alt={community.community_view.community.name}
      />
      <span class="flex flex-row items-center gap-1 text-sm">
        <Icon src={Calendar} width={16} height={16} mini />
        <RelativeDate
          date={new Date(community.community_view.community.published)}
        />
      </span>
      <div class="text-sm flex flex-row flex-wrap gap-3">
        <span class="flex flex-row items-center gap-1">
          <Icon src={UserGroup} width={16} height={16} mini />
          <FormattedNumber
            number={community.community_view.counts.subscribers}
          />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={PencilSquare} width={16} height={16} mini />
          <FormattedNumber number={community.community_view.counts.posts} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
          <FormattedNumber number={community.community_view.counts.comments} />
        </span>
      </div>
      <h1 class="font-bold text-lg">
        {community.community_view.community.name}
      </h1>
      <SvelteMarkdown source={community.community_view.community.description} />
    {/await}
  </Card>
</div>
