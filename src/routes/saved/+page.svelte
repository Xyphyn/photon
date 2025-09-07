<script lang="ts">
  import { page } from '$app/state'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Fixate from '$lib/components/ui/generic/Fixate.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/layout/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { searchParam } from '$lib/util.svelte.js'
  import type { CommentView, PostView } from '$lib/client/types'
  import { Select } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import {
    AdjustmentsHorizontal,
    Bars3,
    Bookmark,
    ChatBubbleOvalLeft,
    Icon,
    PencilSquare,
  } from 'svelte-hero-icons'
  import { PostItem } from '$lib/components/lemmy/post'

  let { data } = $props()

  let type = $state(data.type)!

  const isComment = (item: CommentView | PostView): item is CommentView =>
    'comment' in item
</script>

<svelte:head>
  <title>{$t('routes.saved')}</title>
</svelte:head>

<Header pageHeader>
  {$t('routes.saved')}

  {#snippet extended()}
    <div class="flex items-center">
      <Select
        bind:value={type}
        onchange={() => searchParam(page.url, 'type', type, 'page')}
      >
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
    </div>
  {/snippet}
</Header>

{#if !data.data || (data.data?.length ?? 0) == 0}
  <Placeholder
    icon={Bookmark}
    title="No saved items"
    description="Save posts or comments, and they'll be here to refer to them later."
    class="my-auto"
  />
{:else}
  <CommonList items={data.data} size="lg">
    {#snippet item(item)}
      {#if isComment(item)}
        <CommentItem comment={item} />
      {:else}
        <PostItem post={item} />
      {/if}
    {/snippet}
  </CommonList>
{/if}
<Fixate placement="bottom">
  <Pageination
    hasMore={data.data.length == 40}
    href={(page) => `?page=${page}`}
    page={data.page}
  />
</Fixate>
