<script lang="ts">
  import { goto } from '$app/navigation'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import {
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
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
  <div class="flex flex-col sm:flex-row gap-2 sm:ml-auto">
    <TextInput class="rounded-md" bind:value={search} />
    <Button
      on:click={() => {
        $page.url.searchParams.set('q', search)
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
      color={Color.ghost}
    >
      Search
    </Button>
  </div>
</div>
<ul class="flex flex-col">
  {#each data.communities as community}
    <li>
      <div
        class="py-4 border-b border-black/20 dark:border-white/20
  flex flex-col gap-1 text-sm"
      >
        <div class="flex flex-row justify-between items-center">
          <span
            class="break-words max-w-full w-max text-base font-bold text-sky-400 hover:underline"
          >
            <CommunityLink avatar community={community.community} />
          </span>
          <div class="w-24">
            <Subscribe {community} let:subscribe let:subscribing>
              <Button
                disabled={subscribing}
                loading={subscribing}
                large
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
                  ? Color.accent
                  : Color.ghost}
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
