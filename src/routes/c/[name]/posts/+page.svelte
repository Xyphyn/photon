<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import Avatar from '../../../post/[id]/Avatar.svelte'
  import Post from '../../../post/[id]/Post.svelte'
  import { goto } from '$app/navigation'

  export let data
</script>

<div class="flex flex-row gap-4 justify-between">
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
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
    class="sticky top-4 bg-white border border-slate-200 dark:border-zinc-800
  dark:bg-zinc-900 break-words hidden lg:flex flex-col gap-4 p-8 max-w-sm rounded-md h-max"
  >
    <Avatar
      width={48}
      url={data.community_view.community.icon ??
        `https://api.dicebear.com/6.x/initials/svg?seed=${data.community_view.community.name}`}
      alt={data.community_view.community.name}
    />
    <h1 class="font-bold text-lg">{data.community_view.community.name}</h1>
    <SvelteMarkdown source={data.community_view.community.description} />
  </div>
</div>
