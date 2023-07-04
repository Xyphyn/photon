<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import Card from '$lib/components/ui/StickyCard.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import {
    Calendar,
    ChatBubbleLeftEllipsis,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    Newspaper,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'
  import Avatar from '../lib/components/ui/Avatar.svelte'
  import Post from './post/[id]/Post.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'

  export let data
</script>

<div class="flex flex-row gap-4">
  <div class="flex flex-col gap-4 max-w-full">
    <div class="flex flex-col sm:flex-row gap-4 max-w-full">
      <MultiSelect
        options={['Subscribed', 'Local', 'All']}
        selected={$page.url.searchParams.get('type') ?? 'Local'}
        on:select={(e) => {
          const url = $page.url
          url.searchParams.set('type', e.detail)
          url.searchParams.delete('page')
          goto(url, {
            invalidateAll: true,
          })
        }}
      />
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

    <div class="flex flex-col gap-4 w-full">
      {#each data.posts.posts as post}
        <Post {post} />
      {/each}
    </div>

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
  <div class="ml-auto hidden lg:block max-w-sm w-full">
    {#await data.streamed.site}
      <Card>
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
          class="w-36 mt-4 h-4 bg-slate-200 dark:bg-zinc-700 animate-pulse
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
      </Card>
    {:then site}
      <Card>
        <Avatar
          width={64}
          url={site.site_view.site.icon ?? ''}
          alt={site.site_view.site.name}
        />
        <span class="flex flex-row items-center gap-1 text-sm">
          <Icon src={Calendar} width={16} height={16} mini />
          <RelativeDate date={new Date(site.site_view.site.published)} />
        </span>
        <div class="text-sm flex flex-row flex-wrap gap-3">
          <span class="flex flex-row items-center gap-1">
            <Icon src={UserGroup} width={16} height={16} mini />
            <FormattedNumber number={site.site_view.counts.users} />
          </span>
          <span class="flex flex-row items-center gap-1">
            <Icon src={PencilSquare} width={16} height={16} mini />
            <FormattedNumber number={site.site_view.counts.posts} />
          </span>
          <span class="flex flex-row items-center gap-1">
            <Icon
              src={ChatBubbleOvalLeftEllipsis}
              width={16}
              height={16}
              mini
            />
            <FormattedNumber number={site.site_view.counts.comments} />
          </span>
          <span class="flex flex-row items-center gap-1">
            <Icon src={Newspaper} width={16} height={16} mini />
            <FormattedNumber number={site.site_view.counts.communities} />
          </span>
        </div>
        <h1 class="font-bold text-lg">{site.site_view.site.name}</h1>
        <Markdown source={site.site_view.site.description ?? ''} />
      </Card>
    {:catch}
      <Card>
        <h1 class="font-bold text-lg">Failed to load</h1>
      </Card>
    {/await}
  </div>
</div>
