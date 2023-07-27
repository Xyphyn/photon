<script lang="ts">
  import { page } from '$app/stores'
  import Link from '$lib/components/input/Link.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import Post from '../../../lib/components/lemmy/post/Post.svelte'
  import { goto } from '$app/navigation'
  import Card from '$lib/components/ui/StickyCard.svelte'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { Color } from '$lib/ui/colors'
  import { fly } from 'svelte/transition'
  import { userSettings } from '$lib/settings.js'
  import Modal from '$lib/components/ui/modal/Modal.svelte'

  export let data

  let sidebar: boolean = false
</script>

<svelte:head>
  <title>{data.posts.posts[0]?.community.name}</title>
  <meta
    name="og:title"
    content={data.community.community_view.community.name}
  />
  {#if data.community.community_view.community.description}
    <meta
      name="og:description"
      content={data.community.community_view.community.description}
    />
  {/if}
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<Modal bind:open={sidebar}>
  <span slot="title">Sidebar</span>
  <div class="mx-auto">
    <CommunityCard community_view={data.community.community_view} />
  </div>
</Modal>

<div class="flex flex-col md:flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <h1 class="text-2xl font-bold">
      {data.community.community_view.community.title}
    </h1>
    <div class="md:hidden">
      <Button color="secondary" on:click={() => (sidebar = true)}>
        Sidebar
      </Button>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 max-w-full w-full">
      <MultiSelect
        options={['Active', 'Hot', 'TopAll', 'New']}
        optionNames={['Active', 'Hot', 'Top', 'New']}
        selected={$page.url.searchParams.get('sort') ??
          $userSettings.defaultSort.sort}
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
    {#each data.posts.posts as post, index (post.post.id)}
      <div in:fly={{ y: -8, opacity: 0, delay: index < 4 ? index * 100 : 0 }}>
        <Post {post} />
      </div>
    {/each}
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
  <div class="hidden md:block">
    <CommunityCard community_view={data.community.community_view} />
  </div>
</div>
