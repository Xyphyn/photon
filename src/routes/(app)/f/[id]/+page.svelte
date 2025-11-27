<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { communityLink } from '$lib/app/util.svelte'
  import type { FeedTypes } from '$lib/feature/feeds/feed.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import { PostListShell } from '$lib/ui/layout'
  import { Expandable, Spinner } from 'mono-svelte'
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
