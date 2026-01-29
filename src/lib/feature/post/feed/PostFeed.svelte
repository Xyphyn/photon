<script lang="ts">
  import type { PostView } from '$lib/api/types'
  import { settings } from '$lib/app/settings.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { ArchiveBox, ArrowsPointingOut, Plus } from 'svelte-hero-icons/dist'
  import { Post } from '..'
  import { filterPost, type FilteredItem } from '../filters'
  import { t } from '$lib/app/i18n'

  interface Props {
    posts: PostView[]
    community?: boolean
    children?: Snippet
  }

  let { posts = $bindable(), community = false, children }: Props = $props()

  let filteredPosts: FilteredItem[] = $derived(
    posts.map((post) => ({
      id: post.post.id,
      action: filterPost(post, settings.filters),
    })),
  )

  const removePost = (postId: number) => {
    const index = posts.findIndex((post) => post.post.id === postId)
    if (index === -1) return
    posts = posts.toSpliced(index, 1)
  }
</script>

<ul
  class="flex flex-col list-none divide-y divide-slate-200 dark:divide-zinc-800"
>
  {#if posts.length === 0}
    <div class="h-full grid place-items-center">
      <Placeholder
        icon={ArchiveBox}
        title="No posts"
        description="There are no posts that match this filter."
      >
        <Button href="/communities" icon={Plus}>
          <span>Follow some communities</span>
        </Button>
      </Placeholder>
    </div>
  {:else}
    {#each posts as post, row (post.post.id)}
      {@const filter = filteredPosts[row]}
      {#if filter.action != 'hide'}
        <li class="relative post-container">
          {#if filter.action == 'none'}
            <Post
              hideCommunity={community}
              view={(post.post.featured_community ||
                post.post.featured_local) &&
              settings.posts.compactFeatured
                ? 'compact'
                : settings.view}
              {post}
              class="transition-all duration-250"
              onhide={() => removePost(post.post.id)}
            />
          {:else if filteredPosts[row].action == 'minimize'}
            <Button
              onclick={() => (filteredPosts[row].action = 'none')}
              color="tertiary"
              rounding="none"
              icon={ArrowsPointingOut}
              class="text-slate-400 dark:text-zinc-600 w-full"
              size="xs"
            >
              {$t('settings.lemmy.contentFilter.minimized')}
            </Button>
          {/if}
        </li>
      {/if}
    {/each}
  {/if}
  {@render children?.()}
</ul>
