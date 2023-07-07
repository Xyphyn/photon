<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Post from '$lib/components/lemmy/Post.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'

  export let data
</script>

<svelte:head>
  <title>Xylemmy</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-col sm:flex-row gap-4 max-w-full w-full">
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
    <div class="flex flex-col gap-4">
      {#each data.posts.posts as post}
        <Post {post} />
      {/each}
    </div>
    <div>
      <Button
        on:click={() => {
          $page.url.searchParams.set(
            'page',
            ((Number($page.url.searchParams.get('page')) || 1) + 1).toString()
          )

          goto($page.url.toString(), {
            invalidateAll: true,
          })
        }}
      >
        Next
      </Button>
    </div>
  </div>
  {#await data.streamed.site}
    <StickyCard>
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
    </StickyCard>
  {:then site}
    <SiteCard site={site.site_view} />
  {:catch}
    <StickyCard>
      <h1 class="font-bold text-lg">Failed to load</h1>
    </StickyCard>
  {/await}
</div>
