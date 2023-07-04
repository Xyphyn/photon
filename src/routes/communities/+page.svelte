<script lang="ts">
  import { goto } from '$app/navigation'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import {
    ChatBubbleLeftEllipsis,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
    UserGroup,
  } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/community/CommunityLink.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import { Color } from '$lib/ui/colors.js'
  import TextInput from '$lib/components/input/TextInput.svelte'

  export let data

  let search = ''
</script>

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
    <TextInput
      class="bg-slate-100 border border-slate-200 dark:border-zinc-800
  dark:bg-zinc-900 rounded-md"
      bind:value={search}
    />
    <Link
      href={(function () {
        $page.url.searchParams.set('q', search)
        return $page.url.toString()
      })()}
      color={Color.ghost}
    >
      Search
    </Link>
  </div>
</div>
<ul class="flex flex-col">
  {#each data.communities as community}
    <li>
      <div
        class="py-4 border-b border-black/20 dark:border-white/20
  flex flex-col gap-1 text-sm"
      >
        <span
          class="break-words max-w-full w-max text-base font-bold text-sky-400 hover:underline"
        >
          <CommunityLink community={community.community} />
        </span>
        {#if !community.community.local}
          <span class="opacity-80">
            {new URL(community.community.actor_id).hostname}
          </span>
        {/if}
        <div class="flex flex-row gap-3 items-center mt-2">
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
