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
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import { Color } from '$lib/ui/colors.js'
  import TextInput from '$lib/components/input/TextInput.svelte'
  import Subscribe from './Subscribe.svelte'
  import Button from '$lib/components/input/Button.svelte'

  export let data

  let search = ''
</script>

<svelte:head>
  <title>Communities</title>
</svelte:head>

<div class="flex flex-col sm:flex-row gap-4">
  <MultiSelect
    options={['Subscribed', 'Local', 'All']}
    selected={$page.url.searchParams.get('type') ?? 'All'}
    on:select={(e) => {
      const url = $page.url
      url.searchParams.set('type', e.detail)
      url.searchParams.delete('page')
      goto(url, {
        invalidateAll: true,
      })
    }}
  />
  <div class="flex flex-col sm:flex-row gap-2 sm:ml-auto items-center">
    <TextInput bind:value={search}
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
            <CommunityLink avatar community={community.community} />
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
{/if}
