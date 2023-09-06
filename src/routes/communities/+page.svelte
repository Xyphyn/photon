<script lang="ts">
  import { goto } from '$app/navigation'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import {
    ChatBubbleOvalLeftEllipsis,
    GlobeAmericas,
    Icon,
    PencilSquare,
    QuestionMarkCircle,
    UserGroup,
  } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Subscribe from './Subscribe.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { searchParam } from '$lib/util.js'
  import { addSubscription } from '$lib/lemmy/user.js'
  import { LINKED_INSTANCE_URL } from '$lib/instance.js'
  import { profile } from '$lib/auth.js'
  import { _ } from 'svelte-i18n'
  import { Button, Select, TextInput } from 'mono-svelte'
  import Sort from '$lib/components/lemmy/Sort.svelte'

  export let data

  let search = ''
</script>

<svelte:head>
  <title>{$_('page.communities.communities')}</title>
</svelte:head>

<h1 class="text-2xl font-bold">{$_('page.communities.communities')}</h1>
<p class="text-slate-600 dark:text-zinc-400 mt-2">
  Can't find a community on your home instance? Go to the <a
    href="/search"
    class="text-blue-500 hover:underline"
  >
    search
  </a>
  page, and search with this syntax:
  <code>!community@instance.com</code>
</p>
<div class="flex flex-row flex-wrap gap-4 mt-4">
  <Select
    bind:value={data.type}
    on:change={() => searchParam($page.url, 'type', data.type ?? 'All', 'page')}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={GlobeAmericas} mini size="15" />
      Location
    </span>
    <option value="All">All</option>
    <option value="Local">Local</option>
    <option value="Subscribed">Subscribed</option>
  </Select>
  <Sort selected={data.sort} />
  <div class="flex flex-col sm:flex-row gap-2 sm:ml-auto items-center">
    <TextInput
      bind:value={search}
      on:change={() => () => searchParam($page.url, 'q', search, 'page')}
    />
    <Button
      on:click={() => searchParam($page.url, 'q', search, 'page')}
      color="ghost"
      class="h-max"
    >
      Search
    </Button>
  </div>
</div>
<ul class="flex flex-col divide-y dark:divide-zinc-800">
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
    <li class="py-3">
      <div
        class="
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
                disabled={subscribing || !$profile?.jwt}
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
                      res.community_view.subscribed == 'Subscribed' ||
                        res.community_view.subscribed == 'Pending'
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
