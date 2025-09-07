<script lang="ts">
  import { page } from '$app/state'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ItemList from '$lib/components/lemmy/generic/ItemList.svelte'
  import { PostItem } from '$lib/components/lemmy/post'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import EntityHeader from '$lib/components/ui/EntityHeader.svelte'
  import Expandable from '$lib/components/ui/Expandable.svelte'
  import { CommonList, Header, Pageination } from '$lib/components/ui/layout'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { formatRelativeDate } from '$lib/components/util/RelativeDate.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { communityLink } from '$lib/lemmy/generic.js'
  import { isCommentView } from '$lib/lemmy/item.js'
  import { Option, Select } from 'mono-svelte'
  import { AdjustmentsHorizontal, Icon, PencilSquare } from 'svelte-hero-icons'
  import type { PageData } from './$types'
  import UserActions from './UserActions.svelte'

  interface Props {
    data: PageData
    inline?: boolean
  }

  let { data, inline = false }: Props = $props()

  let sortForm = $state<HTMLFormElement>()
</script>

<svelte:head>
  <title>{data.person_view.value.person.name}</title>
</svelte:head>

<div class="flex flex-col gap-4 max-w-full w-full">
  {#if !inline}
    <Header pageHeader class="tracking-normal!">
      <div class="w-full">
        <EntityHeader
          avatarCircle
          avatar={data.person_view.value.person.avatar}
          name={data.person_view.value.person.display_name ||
            data.person_view.value.person.name}
          banner={data.person_view.value.person.banner}
          bio={data.person_view.value.person.bio}
          stats={[
            {
              name: $t('content.posts'),
              value: data.person_view.value.counts.post_count.toString(),
            },
            {
              name: $t('content.comments'),
              value: data.person_view.value.counts.comment_count.toString(),
            },
            {
              name: $t('stats.joined'),
              value: formatRelativeDate(
                publishedToDate(data.person_view.value.person.published),
                { style: 'short' },
              ).toString(),
              format: false,
            },
          ]}
        >
          {#snippet nameDetail()}
            <span class="text-sm flex gap-0 items-center w-max">
              @
              <UserLink
                showInstance
                user={data.person_view.value.person}
                displayName={false}
                class="font-normal"
              />
            </span>
          {/snippet}
          {#if (data.moderates.value ?? []).length > 0}
            <Expandable class="">
              {#snippet title()}
                {$t('routes.profile.moderates')}
                <hr
                  class="flex-1 w-full border-slate-200 dark:border-zinc-800 mx-3"
                />
              {/snippet}
              <ItemList
                items={data.moderates.value.map((m) => ({
                  id: m.community.id,
                  name: m.community.title,
                  url: communityLink(m.community),
                  avatar: m.community.icon,
                  instance: new URL(m.community.actor_id).hostname,
                }))}
              />
            </Expandable>
          {/if}
          {#snippet actions()}
            <UserActions person={data.person_view.value} />
          {/snippet}
        </EntityHeader>
      </div>
      {#snippet extended()}
        <div class="flex flex-col gap-4 max-w-full w-full min-w-0">
          <form
            action={page.url.origin + page.url.pathname}
            method="GET"
            class="flex flex-row gap-4 flex-wrap"
            bind:this={sortForm}
          >
            <Select
              bind:value={data.filters.value.type}
              name="type"
              onchange={() => sortForm?.requestSubmit()}
            >
              {#snippet customLabel()}
                <span class="flex items-center gap-1">
                  <Icon src={AdjustmentsHorizontal} size="15" mini />
                  {$t('filter.type')}
                </span>
              {/snippet}
              <Option value="all">{$t('content.all')}</Option>
              <Option value="posts">{$t('content.posts')}</Option>
              <Option value="comments">{$t('content.comments')}</Option>
            </Select>
            <Sort
              bind:selected={data.filters.value.sort}
              onchange={() => sortForm?.requestSubmit()}
            />
          </form>
        </div>
      {/snippet}
    </Header>
  {/if}

  {#if data.items.value.length == 0}
    <Placeholder
      icon={PencilSquare}
      title="No submissions"
      description="This user has no submissions that match this filter."
    />
  {:else}
    <CommonList items={data.items.value}>
      {#snippet item(item)}
        {#if isCommentView(item)}
          <CommentItem comment={item} />
        {:else if !isCommentView(item)}
          <PostItem post={item} />
        {/if}
      {/snippet}
    </CommonList>
  {/if}
  <Pageination
    bind:page={data.filters.value.page}
    href={(page) => `?page=${page}`}
  />
</div>
