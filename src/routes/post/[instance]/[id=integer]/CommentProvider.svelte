<script lang="ts">
  import { browser } from '$app/environment'
  import { page } from '$app/state'
  import type { CommentSortType, CommentView, PostView } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import CommentForm from '$lib/feature/comment/CommentForm.svelte'
  import CommentListVirtualizer from '$lib/feature/comment/CommentListVirtualizer.svelte'
  import { buildCommentsTree } from '$lib/feature/comment/comments.svelte'
  import CommentTree from '$lib/feature/comment/CommentTree.svelte'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { Button, Option, Select } from 'mono-svelte'
  import { onMount } from 'svelte'
  import {
    ArrowPath,
    ArrowTrendingDown,
    ChatBubbleOvalLeft,
    Clock,
    Fire,
    Icon,
    Star,
    Trophy,
  } from 'svelte-hero-icons/dist'

  interface Props {
    post: PostView
    comments: CommentView[]
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

  let tree = $state(buildCommentsTree(comments))
  $effect(() => {
    tree = buildCommentsTree(comments)
  })

  onMount(() => {
    if (browser && !isNaN(Number(page.url.hash.slice(1)) || NaN))
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
    <EndPlaceholder border={false}>
      <Button
        color="primary"
        rounding="xl"
        disabled={(post.post.locked || post.banned_from_community) &&
          !(
            profile.current?.user?.local_user_view.local_user.admin ||
            profile.current?.user?.moderates
              .map((c) => c.community.id)
              .includes(post.community.id)
          )}
        onclick={() => (commenting = true)}
      >
        <Icon src={ChatBubbleOvalLeft} size="16" micro />
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
            icon={ArrowPath}
          ></Button>
        </div>
      {/snippet}
    </EndPlaceholder>
  {:else}
    <CommentForm
      postId={post.post.id}
      oncomment={(comment) => {
        tree.unshift({
          children: [],
          depth: 1,
          expanded: true,
          comment_view: comment.comment_view,
        })
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
    <Button
      size="custom"
      class="h-8.5 w-8.5"
      rounding="xl"
      onclick={onupdate}
      icon={ArrowPath}
    ></Button>
  </div>
{/if}
{#if virtualize}
  <CommentListVirtualizer post={post.post} nodes={tree} scrollTo={focus} />
{:else}
  <div class="divide-y divide-slate-200 dark:divide-zinc-800">
    <div class="-mx-3 sm:-mx-6 px-3 sm:px-6">
      <CommentTree nodes={tree} post={post.post} />
    </div>
  </div>
{/if}
