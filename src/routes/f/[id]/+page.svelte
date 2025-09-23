<script lang="ts">
  import ItemList from '$comp/lemmy/generic/ItemList.svelte'
  import EntityHeader from '$comp/ui/EntityHeader.svelte'
  import Expandable from '$comp/ui/Expandable.svelte'
  import { PostListShell } from '$comp/ui/layout'
  import { t } from '$lib/i18n/translations.js'
  import type { FeedTypes } from '$lib/lemmy/feeds/feed.svelte.js'
  import { communityLink } from '$lib/util.svelte.js'
  import { Spinner } from 'mono-svelte'
  import { SvelteURL } from 'svelte/reactivity'

  interface Props {
    data: FeedTypes['/f/[id]'][1]
  }

  let { data = $bindable() }: Props = $props()

  let title = $state('Loading...')
  data.feed.then((i) => (title = i?.title ?? ''))
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>

<PostListShell
  posts={data.posts}
  cursor={data.next_page}
  client={data.client}
  getParams={data.params}
  params={{
    sort: data.params.sort!,
  }}
>
  {#snippet extended()}
    <div class="min-h-56 grid place-items-center">
      {#await data.feed}
        <Spinner width={32} />
      {:then feed}
        {#if feed}
          <EntityHeader
            class="w-full relative flex flex-col"
            compact="always"
            avatarCircle={false}
            name={feed.title}
            avatar={feed.icon}
          >
            {#snippet nameDetail()}
              <p class="text-lg">{feed.name}</p>
            {/snippet}
            {#if feed.communities}
              <Expandable>
                {#snippet title()}
                  {$t('content.communities')}
                {/snippet}
                <ItemList
                  items={feed.communities.map((i) => ({
                    id: i.id,
                    name: i.title,
                    url: communityLink(i),
                    avatar: i.icon,
                    instance: new SvelteURL(i.actor_id).hostname,
                  }))}
                />
              </Expandable>
            {/if}
          </EntityHeader>
        {/if}
      {/await}
    </div>
  {/snippet}
</PostListShell>
