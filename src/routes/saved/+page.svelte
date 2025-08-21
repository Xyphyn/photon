<script lang="ts">
  import { page } from '$app/state'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import PostItem from '$lib/components/lemmy/post/PostItem.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { searchParam } from '$lib/util.svelte.js'
  import type { CommentView, PostView } from 'lemmy-js-client'
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

<div class="h-3 sm:h-6"></div>

{#if !data.data || (data.data?.length ?? 0) == 0}
  <Placeholder
    icon={Bookmark}
    title="No saved items"
    description="Save posts or comments, and they'll be here to refer to them later."
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
<div class="sticky z-30 mx-auto max-w-full bottom-22 lg:bottom-6">
  <Pageination href={page => `?page=${page}`} page={data.page} />
</div>
