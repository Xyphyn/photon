<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { proxify } from '$lib/app/util/reactivity.svelte.js'
  import { CommentModel } from '$lib/feature/comment/comment.svelte.js'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import { Listing } from '$lib/feature/feeds/listing.svelte.js'
  import { repos } from '$lib/feature/feeds/repo.svelte.js'
  import { PostItem } from '$lib/feature/post'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import SearchBar from '$lib/ui/layout/SearchBar.svelte'
  import { Option, Select } from 'mono-svelte'
  import {
    AdjustmentsHorizontal,
    Bars3,
    Bookmark,
    ChatBubbleOvalLeft,
    Icon,
    MagnifyingGlass,
    PencilSquare,
  } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let listing = $derived(
    new Listing(data.items, (i) => (i.type_ == 'post' ? repos.posts.get(i) : new CommentModel(i))),
  )
  let params = $derived(proxify(data.params))
  let form = $state<HTMLFormElement>()
</script>

<svelte:head>
  <title>{$t('routes.saved.title')}</title>
</svelte:head>

<Header pageHeader>
  {$t('routes.saved.title')}

  {#snippet extended()}
    <form method="get" action="/saved" class="contents" bind:this={form}>
      <SearchBar bind:query={params.query} placeholder={$t('routes.saved.search')} />
      <Select bind:value={params.type} onchange={() => form?.requestSubmit()}>
        {#snippet customLabel()}
          <div class="flex items-center gap-0.5">
            <Icon src={AdjustmentsHorizontal} size="15" mini />
            {$t('filter.filter')}
          </div>
        {/snippet}
        <Option icon={Bars3} value="all">
          {$t('content.all')}
        </Option>
        <Option icon={PencilSquare} value="posts">
          {$t('content.posts')}
        </Option>
        <Option icon={ChatBubbleOvalLeft} value="comments">
          {$t('content.comments')}
        </Option>
      </Select>
    </form>
  {/snippet}
</Header>

{#if listing.items.length == 0 && params.query == null}
  <Placeholder
    icon={Bookmark}
    title={$t('routes.saved.placeholder.title')}
    description={$t('routes.saved.placeholder.description')}
    class="my-auto"
  />
{:else if listing.items.length == 0}
  <Placeholder
    icon={MagnifyingGlass}
    title={$t('routes.saved.noResults.title')}
    description={$t('routes.saved.noResults.description')}
    class="my-auto"
  />
{:else}
  <CommonList items={listing.items} size="lg">
    {#snippet item(item)}
      {#if item instanceof CommentModel}
        <CommentItem comment={item} />
      {:else}
        <PostItem post={item} />
      {/if}
    {/snippet}
  </CommonList>
{/if}

{#if params.next != null || params.prev != null}
  <Fixate placement="bottom">
    <Pageination
      cursor={{
        next: params.next,
        back: params.prev,
      }}
      hasMore={params.next != null}
      href={(cursor) => `?cursor=${cursor}`}
    />
  </Fixate>
{/if}
