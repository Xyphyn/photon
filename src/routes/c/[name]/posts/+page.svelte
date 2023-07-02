<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import Avatar from '../../../post/[id]/Avatar.svelte'
  import Post from '../../../post/[id]/Post.svelte'
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
    {#each data.posts as post}
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
  <div
    class="sticky top-4 bg-white border border-slate-200
    dark:border-zinc-800 dark:bg-zinc-900 break-words hidden lg:flex
    flex-col gap-4 p-8 max-w-sm rounded-md h-max max-h-[calc(100vh-2rem)] overflow-auto"
  >
    <Avatar
      width={48}
      url={data.community_view.community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${data.community_view.community.name}`}
      alt={data.community_view.community.name}
    />
    <span class="flex flex-row items-center gap-1 text-sm">
      <Icon src={Calendar} width={16} height={16} mini />
      <RelativeDate date={new Date(data.community_view.community.published)} />
    </span>
    <div class="text-sm flex flex-row flex-wrap gap-3">
      <span class="flex flex-row items-center gap-1">
        <Icon src={UserGroup} width={16} height={16} mini />
        <FormattedNumber number={data.community_view.counts.subscribers} />
      </span>
      <span class="flex flex-row items-center gap-1">
        <Icon src={PencilSquare} width={16} height={16} mini />
        <FormattedNumber number={data.community_view.counts.posts} />
      </span>
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
        <FormattedNumber number={data.community_view.counts.comments} />
      </span>
    </div>
    <h1 class="font-bold text-lg">{data.community_view.community.name}</h1>
    <SvelteMarkdown source={data.community_view.community.description} />
  </div>
</div>
