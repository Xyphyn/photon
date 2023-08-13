<script lang="ts">
  import { goto } from '$app/navigation'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import {
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
    QuestionMarkCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Subscribe from './Subscribe.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { searchParam } from '$lib/util.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import Link from '$lib/components/input/Link.svelte'

  export let data

  let search = ''
</script>

<svelte:head>
  <title>Communities</title>
</svelte:head>

<h1 class="text-2xl font-bold">Communities</h1>
<p class="text-slate-600 dark:text-zinc-400 mt-2">
  Can't find a community on your home instance? Go to the <Link
    href="/search"
    highlight
  >
    search
  </Link> page, and search with this syntax:
  <code>!community@instance.com</code>
</p>
<div class="flex flex-col sm:flex-row gap-4 mt-4">
  <MultiSelect
    options={['Subscribed', 'Local', 'All']}
    selected={$page.url.searchParams.get('type') ?? 'All'}
    on:select={(e) => searchParam($page.url, 'type', e.detail, 'page')}
  />
  <div class="flex flex-col sm:flex-row gap-2 sm:ml-auto items-center">
    <TextInput
      bind:value={search}
      on:change={() => {
        $page.url.searchParams.set('q', search)
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
    <Button
      on:click={() => {
        $page.url.searchParams.set('q', search)
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
      color="ghost"
      class="h-max"
    >
      Search
    </Button>
  </div>
</div>
<ul class="flex flex-col">
  {#if data.communities.length == 0}
    <div
      class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center py-8"
    >
      <Icon src={QuestionMarkCircle} size="32" solid />
      <h1 class="font-bold text-2xl">No communities</h1>
      <p class="mt-2 text-center">
        There are no communities with that name. Try refining your search.
      </p>
    </div>
  {/if}
  {#each data.communities as community}
    <li>
      <div
        class="py-4 border-b border-black/20 dark:border-white/20
  flex flex-col gap-1 text-sm max-w-full"
      >
        <div class="flex flex-row items-center">
          <span
            class="break-words max-w-full w-max text-base font-bold text-sky-400 hover:underline"
          >
            <CommunityLink
              showInstance={false}
              avatar
              community={community.community}
            />
          </span>
          <div class="ml-auto">
            <Subscribe {community} let:subscribe let:subscribing>
              <Button
                disabled={subscribing}
                loading={subscribing}
                on:click={async () => {
                  const res = await subscribe()

                  if (res) {
                    community.subscribed =
                      res.community_view.subscribed != 'NotSubscribed'
                        ? 'Subscribed'
                        : 'NotSubscribed'

                    addSubscription(
                      community.community,
                      res.community_view.subscribed == 'Subscribed'
                    )
                  }
                }}
                color={community.subscribed == 'Subscribed'
                  ? 'primary'
                  : 'ghost'}
              >
                {community.subscribed == 'Subscribed'
                  ? 'Subscribed'
                  : 'Subscribe'}
              </Button>
            </Subscribe>
          </div>
        </div>
        <span class="opacity-80 mb-2">
          {new URL(community.community.actor_id).hostname}
        </span>
        <div class="flex flex-row gap-3 items-center">
          <div class="flex flex-row gap-1 items-center">
            <Icon src={UserGroup} width={16} mini />
            <span>
              {Intl.NumberFormat('en', { notation: 'compact' }).format(
                community.counts.subscribers
              )}
            </span>
          </div>
          <div class="flex flex-row gap-1 items-center">
            <Icon src={PencilSquare} mini width={16} />
            <span>
              {Intl.NumberFormat('en', { notation: 'compact' }).format(
                community.counts.posts
              )}
            </span>
          </div>
          <div class="flex flex-row gap-1 items-center">
            <Icon src={ChatBubbleOvalLeftEllipsis} mini width={16} />
            <span>
              {Intl.NumberFormat('en', { notation: 'compact' }).format(
                community.counts.comments
              )}
            </span>
          </div>
        </div>
      </div>
    </li>
  {/each}
</ul>
{#if data.communities.length > 0}
  <div class="mt-2 w-full">
    <Pageination
      page={Number($page.url.searchParams.get('page')) || 1}
      on:change={(p) => {
        $page.url.searchParams.set('page', p.detail.toString())

        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
  </div>
{/if}
