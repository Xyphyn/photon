<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/Button.svelte'
  import Card from '$lib/components/Card.svelte'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import {
    Calendar,
    ChatBubbleLeftEllipsis,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    Newspaper,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'
  import Avatar from './post/[id]/Avatar.svelte'
  import Post from './post/[id]/Post.svelte'
  import FormattedNumber from '$lib/components/FormattedNumber.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import RelativeDate from '$lib/components/RelativeDate.svelte'

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
    <Card>
      <Avatar
        width={64}
        url={data.site.site_view.site.icon ?? ''}
        alt={data.site.site_view.site.name}
      />
      <span class="flex flex-row items-center gap-1 text-sm">
        <Icon src={Calendar} width={16} height={16} mini />
        <RelativeDate date={new Date(data.site.site_view.site.published)} />
      </span>
      <div class="text-sm flex flex-row flex-wrap gap-3">
        <span class="flex flex-row items-center gap-1">
          <Icon src={UserGroup} width={16} height={16} mini />
          <FormattedNumber number={data.site.site_view.counts.users} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={PencilSquare} width={16} height={16} mini />
          <FormattedNumber number={data.site.site_view.counts.posts} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
          <FormattedNumber number={data.site.site_view.counts.comments} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={Newspaper} width={16} height={16} mini />
          <FormattedNumber number={data.site.site_view.counts.communities} />
        </span>
      </div>
      <h1 class="font-bold text-lg">{data.site.site_view.site.name}</h1>
      <Markdown source={data.site.site_view.site.description ?? ''} />
    </Card>
  </div>
</div>
