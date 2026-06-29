<script lang="ts">
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { communityLink } from '$lib/app/util.svelte'
  import { CommentModel } from '$lib/feature/comment/comment.svelte'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import { Listing } from '$lib/feature/feeds/listing.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte'
  import Sort from '$lib/feature/filter/Sort.svelte'
  import { PostItem } from '$lib/feature/post'
  import { PostModel } from '$lib/feature/post/post.svelte'
  import { UserModel } from '$lib/feature/user/user.svelte'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import EntityHeader from '$lib/ui/generic/EntityHeader.svelte'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'
  import { publishedToDate } from '$lib/ui/util/date'
  import { Expandable, Option, Select } from 'mono-svelte'
  import { formatRelativeDate } from 'mono-svelte/util/RelativeDate.svelte'
  import { AdjustmentsHorizontal, Icon, PencilSquare } from 'svelte-hero-icons/dist'
  import { type PageData } from './$types'
  import UserActions from './UserActions.svelte'

  interface Props {
    data: PageData
    inline?: boolean
  }

  let { data, inline = false }: Props = $props()

  let person = $derived(new UserModel(data.person_view))
  let listing = $derived(
    new Listing(data.items, (i) => {
      if (i.type_ == 'post') return repos.posts.get(i)
      else return new CommentModel(i)
    }),
  )
  let params = $derived(data.params)

  let sortForm = $state<HTMLFormElement>()
</script>

<svelte:head>
  <title>{person.person.name}</title>
</svelte:head>

<div class="flex flex-col gap-4 max-w-full w-full">
  {#if !inline}
    <Header pageHeader class="tracking-normal!">
      <div class="w-full">
        <EntityHeader
          avatarCircle
          avatar={person.person.avatar}
          name={person.person.display_name || person.person.name}
          banner={person.person.banner}
          bio={person.person.bio}
          stats={[
            {
              name: $t('content.posts'),
              value: person.person.post_count.toString(),
            },
            {
              name: $t('content.comments'),
              value: person.person.comment_count.toString(),
            },
            {
              name: $t('stats.joined'),
              value: formatRelativeDate(publishedToDate(person.person.published_at), {
                style: 'short',
              }).toString(),
              format: false,
            },
          ]}
        >
          {#snippet nameDetail()}
            <span class="text-sm flex gap-0 items-center w-max">
              @
              <UserLink showInstance user={person.person} displayName={false} class="font-normal" />
            </span>
          {/snippet}
          {#if (data.moderates ?? []).length > 0}
            <Expandable class="">
              {#snippet title()}
                {$t('routes.profile.moderates')}
                <hr class="flex-1 w-full border-slate-200 dark:border-zinc-800 mx-3" />
              {/snippet}
              <ItemList
                items={data.moderates.map((m) => ({
                  id: m.community.id,
                  name: m.community.title ?? m.community.name,
                  url: communityLink(m.community),
                  avatar: m.community.icon,
                  instance: new URL(m.community.ap_id).hostname,
                }))}
              />
            </Expandable>
          {/if}
          {#snippet actions()}
            <UserActions {person} />
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
            <Select bind:value={params.type} name="type" onchange={() => sortForm?.requestSubmit()}>
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
            <Sort bind:selected={params.sort} onchange={() => sortForm?.requestSubmit()} />
          </form>
        </div>
      {/snippet}
    </Header>
  {/if}

  {#if listing.items.length == 0}
    <Placeholder
      icon={PencilSquare}
      title="No submissions"
      description="This user has no submissions that match this filter."
    />
  {:else}
    <CommonList items={listing.items}>
      {#snippet item(item)}
        {#if item instanceof CommentModel}
          <CommentItem comment={item} />
        {:else if item instanceof PostModel}
          <PostItem post={item} />
        {/if}
      {/snippet}
    </CommonList>
  {/if}
  {#if params.next != null || params.prev != null}
    <Pageination
      hasMore={params.next != null}
      cursor={{ back: params.prev, next: params.next }}
      href={(cursor) => `?cursor=${cursor}`}
    />
  {/if}
</div>
