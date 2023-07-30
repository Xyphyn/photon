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
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'

  export let data

  let sidebar: boolean = false
</script>

<svelte:head>
  <title>{data.posts.posts[0]?.community.name}</title>
  <meta name="og:title" content={data.community.community.name} />
  {#if data.community.community.description}
    <meta
      name="og:description"
      content={data.community.community.description}
    />
  {/if}
  <meta name="og:url" content={$page.url.toString()} />
</svelte:head>

<Modal bind:open={sidebar}>
  <span slot="title">Sidebar</span>
  <div class="mx-auto">
    <CommunityCard community_view={data.community} />
  </div>
</Modal>

<div class="flex flex-col md:flex-row gap-4 w-full">
  <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
    <div class="flex flex-row gap-3 items-center">
      <Avatar
        width={48}
        url={data.community.community.icon}
        alt={data.community.community.name}
      />
      <div class="flex flex-col gap-0">
        <h1 class="font-bold text-xl">{data.community.community.title}</h1>
        <span class="dark:text-zinc-400 text-slate-600 text-sm">
          !{data.community.community.name}@{new URL(
            data.community.community.actor_id
          ).hostname}
        </span>
      </div>
    </div>
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
        <Post hideCommunity={true} {post} />
      </div>
    {/each}
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
  <div class="hidden md:block">
    <CommunityCard community_view={data.community} />
  </div>
</div>
