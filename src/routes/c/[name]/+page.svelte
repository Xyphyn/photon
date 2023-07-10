<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/input/Link.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Post from '../../../lib/components/lemmy/Post.svelte'
  import { goto } from '$app/navigation'
  import Card from '$lib/components/ui/StickyCard.svelte'
  import CommunityCard from '$lib/components/community/CommunityCard.svelte'

  export let data
</script>

<svelte:head>
  <title>{data.posts.posts[0]?.community.name}</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full">
    <div class="flex flex-col sm:flex-row gap-4 max-w-full w-full">
      <MultiSelect
        options={['Active', 'Hot', 'TopAll', 'New']}
        optionNames={['Active', 'Hot', 'Top', 'New']}
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
  {#await data.streamed.community}
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
    </Card>
  {:then community}
    <CommunityCard community_view={community.community_view} />
  {:catch}
    <Card>
      <p>Failed to load community. This is likely an issue on Lemmy's end.</p>
    </Card>
  {/await}
</div>
