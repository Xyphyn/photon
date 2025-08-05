<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import { profile } from '$lib/auth.svelte'
  import CommentForm from '$lib/components/lemmy/comment/CommentForm.svelte'
  import CommentListVirtualizer from '$lib/components/lemmy/comment/CommentListVirtualizer.svelte'
  import Comments from '$lib/components/lemmy/comment/CommentTree.svelte'
  import { buildCommentsTree } from '$lib/components/lemmy/comment/comments.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte'
  import type {
    CommentSortType,
    GetCommentsResponse,
    PostView,
  } from 'lemmy-js-client'
  import { Button, Option, Select } from 'mono-svelte'
  import { onMount } from 'svelte'
  import {
    ArrowPath,
    ArrowTrendingDown,
    Clock,
    Fire,
    Icon,
    PlusCircle,
    Star,
    Trophy,
  } from 'svelte-hero-icons'

  interface Props {
    post: PostView
    comments: GetCommentsResponse
    sort?: CommentSortType
    onupdate?: () => void
    focus?: string
    virtualize?: boolean
  }

  let {
    post,
    comments,
    sort = $bindable(),
    onupdate,
    focus,
    virtualize = true,
  }: Props = $props()
  let commenting = $state(false)

  let tree = $state(buildCommentsTree(comments.comments))
  $effect(() => {
    tree = buildCommentsTree(comments.comments)
  })

  onMount(() => {
    if (browser && !isNaN(Number(page.url.hash)))
      // hack because virtual list needs to calc heights
      setTimeout(() => {
        document
          .getElementById(page.url.hash.slice(1))
          ?.scrollIntoView({ behavior: 'instant', block: 'center' })
      }, 100)
  })
</script>

{#if profile.current?.jwt}
  {#if !commenting}
    <EndPlaceholder>
      <Button
        color="primary"
        rounding="xl"
        disabled={(post.post.locked || post.banned_from_community) &&
          !(
            profile.current?.user?.local_user_view.local_user.admin ||
            profile.current?.user?.moderates
              .map(c => c.community.id)
              .includes(post.community.id)
          )}
        onclick={() => (commenting = true)}
      >
        <Icon src={PlusCircle} size="16" micro />
        {$t('routes.post.addComment')}
      </Button>

      {#snippet action()}
        <div class="gap-2 flex items-center">
          <Select
            size="md"
            bind:value={settings.defaultSort.comments}
            onchange={onupdate}
          >
            <Option icon={Fire} value="Hot">{$t('filter.sort.hot')}</Option>
            <Option icon={Trophy} value="Top">
              {$t('filter.sort.top.label')}
            </Option>
            <Option icon={Star} value="New">{$t('filter.sort.new')}</Option>
            <Option icon={Clock} value="Old">
              {$t('filter.sort.old')}
            </Option>
            <Option icon={ArrowTrendingDown} value="Controversial">
              {$t('filter.sort.controversial')}
            </Option>
          </Select>
          <Button
            size="custom"
            class="h-8.5 w-8.5"
            rounding="xl"
            onclick={onupdate}
          >
            {#snippet prefix()}
              <Icon src={ArrowPath} size="16" mini />
            {/snippet}
          </Button>
        </div>
      {/snippet}
    </EndPlaceholder>
  {:else}
    <CommentForm
      postId={post.post.id}
      oncomment={comment => {
        comments.comments.unshift(comment.comment_view)
      }}
      onfocus={() => (commenting = true)}
      tools={commenting}
      preview={commenting}
      placeholder={commenting ? undefined : $t('routes.post.addComment')}
      rows={commenting ? 7 : 1}
      oncancel={() => (commenting = false)}
    />
  {/if}
{/if}

{#if commenting || !profile.current.jwt}
  <div class="gap-2 flex items-center">
    <Select
      size="md"
      bind:value={settings.defaultSort.comments}
      onchange={onupdate}
    >
      <Option icon={Fire} value="Hot">{$t('filter.sort.hot')}</Option>
      <Option icon={Trophy} value="Top">
        {$t('filter.sort.top.label')}
      </Option>
      <Option icon={Star} value="New">{$t('filter.sort.new')}</Option>
      <Option icon={Clock} value="Old">
        {$t('filter.sort.old')}
      </Option>
      <Option icon={ArrowTrendingDown} value="Controversial">
        {$t('filter.sort.controversial')}
      </Option>
    </Select>
    <Button size="custom" class="h-8.5 w-8.5" rounding="xl" onclick={onupdate}>
      {#snippet prefix()}
        <Icon src={ArrowPath} size="16" mini />
      {/snippet}
    </Button>
  </div>
{/if}
{#if virtualize}
  <CommentListVirtualizer post={post.post} nodes={tree} scrollTo={focus} />
{:else}
  <div class="divide-y divide-slate-200 dark:divide-zinc-800">
    <div class="-mx-3 sm:-mx-6 px-3 sm:px-6">
      <Comments nodes={tree} post={post.post} />
    </div>
  </div>
{/if}
