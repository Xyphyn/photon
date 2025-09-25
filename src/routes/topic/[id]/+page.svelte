<script lang="ts">
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import Expandable from 'mono-svelte/disclosure/Expandable.svelte'
  import { PostListShell } from '$comp/ui/layout'
  import { t } from '$lib/app/i18n/index.js'
  import { communityLink } from '$lib/util.svelte.js'
  import { Spinner } from 'mono-svelte'
  import { SvelteURL } from 'svelte/reactivity'

  let { data = $bindable() } = $props()

  let title = $state('Loading...')
  data.topic.then((i) => (title = i?.name ?? ''))
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>

<PostListShell
  client={data.client}
  posts={data.posts}
  cursor={data.next_page}
  getParams={data.params}
  params={{
    sort: data.params.sort!,
  }}
>
  {#snippet extended()}
    <div class="min-h-56 grid place-items-center">
      {#await data.topic}
        <Spinner width={32} />
      {:then topic}
        {#if topic}
          <EntityHeader
            class="w-full relative flex flex-col"
            compact="always"
            avatarCircle={false}
            name={topic.name}
          >
            {#snippet nameDetail()}
              <p class="text-lg">{topic.name}</p>
            {/snippet}
            {#if topic.communities}
              <Expandable>
                {#snippet title()}
                  {$t('content.communities')}
                {/snippet}
                <ItemList
                  items={topic.communities.map((i) => ({
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
