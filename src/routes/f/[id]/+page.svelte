<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { communityLink } from '$lib/app/util.svelte'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import { PostListShell } from '$lib/ui/layout'
  import { Expandable } from 'mono-svelte'
  import { SvelteURL } from 'svelte/reactivity'

  let { data } = $props()

  let posts = $derived(proxify(data.posts))
  let community = $derived(data.multi.multi_community_view)
</script>

<svelte:head>
  <title>
    {community.multi.title ?? community.multi.name}
  </title>
</svelte:head>

<PostListShell
  bind:posts
  bind:cursor={data.next_page}
  bind:client={data.client}
  getParams={data.params}
  params={{
    sort: data.params.sort!,
  }}
>
  {#snippet extended()}
    <div class="min-h-56 grid place-items-center">
      <EntityHeader
        class="w-full relative flex flex-col"
        compact="always"
        avatarCircle={false}
        name={community.multi.title ?? community.multi.name}
      >
        {#snippet nameDetail()}
          <p class="text-lg">{community.multi.name}</p>
        {/snippet}
        <Expandable class="tracking-normal">
          {#snippet title()}
            {$t('content.communities')}
          {/snippet}
          <ItemList
            items={data.multi.communities.map((i) => ({
              id: i.community.id,
              name: i.community.title ?? i.community.name,
              url: communityLink(i.community),
              avatar: i.community.icon,
              instance: new SvelteURL(i.community.ap_id).hostname,
            }))}
          />
        </Expandable>
      </EntityHeader>
    </div>
  {/snippet}
</PostListShell>
