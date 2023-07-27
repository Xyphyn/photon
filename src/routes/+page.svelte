<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/input/Button.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { fly, scale } from 'svelte/transition'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { authData } from '$lib/lemmy.js'
  import { userSettings } from '$lib/settings.js'
  import { ArchiveBox, Icon, Plus } from 'svelte-hero-icons'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'

  export let data
</script>

<svelte:head>
  <title>Photon</title>
</svelte:head>

<div class="flex flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <header>
      <h1 class="text-3xl font-bold">Frontpage</h1>
    </header>
    <div
      class="flex flex-col sm:flex-row gap-4 max-w-full w-full justify-between flex-wrap"
      role="radiogroup"
    >
      <MultiSelect
        options={['Subscribed', 'Local', 'All']}
        disabled={[$authData?.token == undefined]}
        selected={data.listingType}
        on:select={(e) => {
          $page.url.searchParams.set('type', e.detail)
          $page.url.searchParams.delete('page')
          goto($page.url.toString(), {
            invalidateAll: true,
          })
        }}
      />
      <MultiSelect
        options={['Active', 'Hot', 'TopAll', 'New']}
        optionNames={['Active', 'Hot', 'Top', 'New']}
        selected={data.sort}
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
    <section class="flex flex-col gap-4">
      {#if data.posts.posts.length == 0}
        <div
          class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center"
        >
          <Icon src={ArchiveBox} size="32" solid />
          <h1 class="font-bold text-2xl">No posts</h1>
          {#if data.listingType == 'Subscribed'}
            <Button href="/communities" class="mt-4">
              <Icon src={Plus} size="16" mini slot="icon" />
              <span>Follow some communities</span>
            </Button>
          {/if}
        </div>
      {/if}
      {#each data.posts.posts as post, index (post.post.id)}
        <div in:fly={{ y: -8, opacity: 0, delay: index < 4 ? index * 100 : 0 }}>
          <Post {post} />
        </div>
      {/each}
    </section>
    <Pageination
      page={data.page}
      on:change={(p) => {
        $page.url.searchParams.set('page', p.detail.toString())
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
  </div>
  <aside class="hidden md:block">
    {#await data.streamed.site}
      <StickyCard>
        <div class="h-64 grid place-items-center">
          <Spinner width={32} />
        </div>
      </StickyCard>
    {:then site}
      <SiteCard site={site.site_view} taglines={site.taglines} />
    {:catch}
      <StickyCard>
        <h1 class="font-bold text-lg">Failed to load</h1>
      </StickyCard>
    {/await}
  </aside>
</div>
