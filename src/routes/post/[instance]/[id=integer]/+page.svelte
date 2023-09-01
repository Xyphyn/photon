<script lang="ts">
  import { buildCommentsTreeAsync } from '$lib/components/lemmy/comment/comments.js'
  import Comments from '$lib/components/lemmy/comment/Comments.svelte'
  import { isImage, isVideo } from '$lib/ui/image.js'
  import { getClient, getInstance } from '$lib/lemmy.js'
  import CommentForm from '$lib/components/lemmy/comment/CommentForm.svelte'
  import { onMount } from 'svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Button from '$lib/components/input/Button.svelte'
  import { page } from '$app/stores'
  import PostActions from '$lib/components/lemmy/post/PostActions.svelte'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import PostLink from '$lib/components/lemmy/post/PostLink.svelte'
  import PostMeta from '$lib/components/lemmy/post/PostMeta.svelte'
  import { removeToast, toast } from '$lib/components/ui/toasts/toasts.js'
  import type { CommentSortType } from 'lemmy-js-client'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { profile } from '$lib/auth.js'
  import { instance } from '$lib/instance.js'
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { userSettings } from '$lib/settings.js'

  export let data

  let post = data.post

  onMount(async () => {
    if (!post.post_view.read && $profile?.jwt) {
      getClient().markPostAsRead({
        auth: $profile.jwt,
        read: true,
        post_id: post.post_view.post.id,
      })
    }
  })

  afterNavigate(async () => {
    // reactivity hack
    post = data.post

    if ($page.params.instance.toLowerCase() != $instance.toLowerCase()) {
      if (!$profile?.jwt) return
      toast({
        content: 'Do you want to open this post on your home instance?',
        action: () => {
          if ($profile?.jwt) fetchOnHome($profile.jwt)
        },
        duration: 9999 * 1000,
      })
    }
  })

  const fetchOnHome = async (jwt: string) => {
    const id = toast({
      content: 'Attempting to fetch this post on your home instance...',
      loading: true,
    })

    try {
      const res = await getClient().resolveObject({
        auth: jwt,
        q: post.post_view.post.ap_id,
      })

      if (res.post) {
        removeToast(id)
        goto(`/post/${$instance}/${res.post.post.id}`, {}).then(() =>
          removeToast(id)
        )
      }
    } catch (err) {
      removeToast(id)
    }
  }

  let commentsPage = 1
  let commentSort: CommentSortType = data.commentSort
  let loading = false
  let moreComments = true

  async function reloadComments() {
    data.singleThread = false
    commentsPage = 1

    data.streamed.comments = getClient().getComments({
      auth: $profile?.jwt,
      page: 1,
      limit: 25,
      type_: 'All',
      post_id: post.post_view.post.id,
      sort: commentSort,
      max_depth: 3,
    })
  }
</script>

<svelte:head>
  <title>{post.post_view.post.name}</title>
  <meta property="og:title" content={post.post_view.post.name} />
  <meta property="og:url" content={$page.url.toString()} />
  {#if isImage(post.post_view.post.url)}
    <meta property="og:image" content={post.post_view.post.url} />
  {/if}
  {#if post.post_view.post.body}
    <meta property="og:description" content={post.post_view.post.body} />
  {/if}
</svelte:head>

<div class="flex flex-col gap-2">
  {#if $page.params.instance.toLowerCase() != $instance.toLowerCase()}
    <Card cardColor="warning" class="p-4 flex flex-col gap-1">
      <Icon
        src={ExclamationTriangle}
        width={24}
        solid
        class="text-yellow-500"
      />
      <h1 class="font-bold">Warning</h1>
      <p class="text-sm">
        This URL is for a different instance than you're logged into. You
        probably won't be able to vote or comment.
      </p>
    </Card>
  {/if}

  <PostMeta
    community={post.post_view.community}
    user={post.post_view.creator}
    upvotes={post.post_view.counts.upvotes}
    downvotes={post.post_view.counts.downvotes}
    deleted={post.post_view.post.deleted}
    removed={post.post_view.post.removed}
    locked={post.post_view.post.locked}
    featured={post.post_view.post.featured_community ||
      post.post_view.post.featured_local}
    nsfw={post.post_view.post.nsfw}
    published={new Date(post.post_view.post.published + 'Z')}
    saved={post.post_view.saved}
  />
  <h1 class="font-bold text-lg">{post.post_view.post.name}</h1>
  {#if isImage(post.post_view.post.url)}
    <img
      src={post.post_view.post.url}
      alt={post.post_view.post.name}
      class="rounded-md max-w-screen max-h-[80svh] mx-auto"
    />
  {:else if isVideo(post.post_view.post.url)}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="rounded-md max-w-screen max-h-[80svh] mx-auto" controls>
      <source src={post.post_view.post.url} />
    </video>
  {:else if post.post_view.post.url && !post.post_view.post.thumbnail_url}
    <a
      href={post.post_view.post.url}
      class="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-sky-400 hover:underline text-xs"
      style="word-break: break-word;"
    >
      {post.post_view.post.url}
    </a>
  {:else if post.post_view.post.thumbnail_url && post.post_view.post.url}
    <PostLink
      thumbnail_url={post.post_view.post.thumbnail_url}
      url={post.post_view.post.url}
      nsfw={post.post_view.post.nsfw}
    />
  {/if}
  {#if post.post_view.post.body}
    <div class="text-base rounded-md leading-[22px]">
      <Markdown source={post.post_view.post.body} />
    </div>
  {/if}
  <div class="w-full relative">
    <PostActions
      bind:post={post.post_view}
      on:edit={() =>
        toast({
          content: 'The post was edited successfully.',
          type: 'success',
        })}
    />
  </div>
  {#if post.cross_posts?.length > 0}
    <details
      class="text-sm font-bold mt-2 w-full cursor-pointer"
      open={post.cross_posts?.length <= 3}
    >
      <summary class="inline-block w-full">
        <SectionTitle class="text-inherit dark:text-inherit">
          Crossposts <span
            class="text-slate-600 dark:text-zinc-400 text-xs ml-1"
          >
            {post.cross_posts.length}
          </span>
        </SectionTitle>
      </summary>
      <div class="divide-y divide-slate-200 dark:divide-zinc-800 flex flex-col">
        {#each post.cross_posts as crosspost}
          <div class="py-2.5 flex flex-col gap-1">
            <span class="text-xs flex flex-col pointer-events-none">
              <CommunityLink
                community={crosspost.community}
                avatarSize={22}
                avatar={true}
              />
            </span>
            <Link
              class="text-sm"
              href="/post/{$page.params.instance}/{crosspost.post.id}"
            >
              {crosspost.post.name}
            </Link>
          </div>
        {/each}
      </div>
    </details>
  {/if}
</div>
<div class="mt-4 flex flex-col gap-2">
  <div class="font-bold text-lg">
    Comments <span class="text-sm font-normal ml-2 opacity-80">
      {post.post_view.counts.comments}
    </span>
  </div>
  <MultiSelect
    options={['Hot', 'Top', 'New']}
    bind:selected={commentSort}
    on:select={reloadComments}
  />
  {#if data.singleThread}
    <Card class="py-2 px-4 text-sm flex flex-row items-center flex-wrap gap-4">
      <p>You're viewing a single thread.</p>
      <Button on:click={reloadComments}>View full thread</Button>
    </Card>
  {/if}
  {#await data.streamed.comments}
    <div class="h-16 mx-auto grid place-items-center">
      <Spinner width={24} />
    </div>
  {:then comments}
    {#if $profile?.user}
      <CommentForm
        postId={post.post_view.post.id}
        on:comment={(comment) =>
          (comments.comments = [
            comment.detail.comment_view,
            ...comments.comments,
          ])}
        locked={post.post_view.post.locked ||
          $page.params.instance.toLowerCase() != $instance.toLowerCase()}
      />
    {/if}
    {#await buildCommentsTreeAsync(comments.comments)}
      <div class="h-16 mx-auto grid place-items-center">
        <Spinner width={36} />
      </div>
    {:then comments}
      <Comments post={post.post_view.post} nodes={comments} isParent={true} />
    {/await}
  {:catch}
    <div class="bg-red-500/10 border border-red-500 rounded-md p-4">
      Failed to load comments.
    </div>
  {/await}
</div>
