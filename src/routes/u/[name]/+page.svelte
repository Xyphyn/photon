<script lang="ts">
  import Post from '$lib/components/lemmy/post/Post.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import StickyCard from '$lib/components/ui/StickyCard.svelte'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import {
    Calendar,
    ChatBubbleOvalLeftEllipsis,
    Icon,
    NoSymbol,
    PencilSquare,
  } from 'svelte-hero-icons'
  import Button from '$lib/components/input/Button.svelte'
  import CommentItem from '$lib/components/lemmy/comment/CommentItem.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { isComment } from '$lib/lemmy/item.js'
  import { authData, getClient, user } from '$lib/lemmy.js'
  import { isBlocked } from '$lib/lemmy/user.js'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'

  export let data

  let blocking = false

  async function blockUser(block: number) {
    if (!$user || !$authData) throw new Error('Unauthenticated')

    blocking = true
    try {
      const blocked = isBlocked($user, block)

      await getClient().blockPerson({
        auth: $authData.token,
        block: !blocked,
        person_id: block,
      })

      if (blocked) {
        const index = $user.person_blocks.map((p) => p.target.id).indexOf(block)
        $user.person_blocks.splice(index, 1)
      }

      toast({
        content: `Successfully ${blocked ? 'unblocked' : 'blocked'} that user.`,
        type: ToastType.success,
      })

      goto($page.url, {
        invalidateAll: true,
      })
    } catch (err) {
      toast({
        content: err as any,
        type: ToastType.error,
      })
    }
    blocking = false
  }
</script>

<svelte:head>
  <title>{data.person_view.person.name}</title>
</svelte:head>

<div class="flex flex-col-reverse lg:flex-row gap-4 max-w-full w-full">
  <div class="flex flex-col gap-4 max-w-full w-full">
    <div class="flex flex-row gap-4 flex-wrap">
      <MultiSelect
        options={['New', 'TopAll']}
        optionNames={['New', 'Top']}
        selected={data.sort}
        on:select={(e) => {
          $page.url.searchParams.set('sort', e.detail)
          goto($page.url.toString(), {
            invalidateAll: true,
          })
        }}
      />
      <MultiSelect
        options={['all', 'posts', 'comments']}
        optionNames={['All', 'Posts', 'Comments']}
        selected={data.type}
        on:select={(e) => {
          $page.url.searchParams.set('type', e.detail)
          goto($page.url.toString(), {
            invalidateAll: true,
          })
        }}
      />
    </div>
    {#each data.items as item (item.counts.id)}
      {#if isComment(item) && (data.type == 'all' || data.type == 'comments')}
        <CommentItem comment={item} />
      {:else if !isComment(item) && (data.type == 'all' || data.type == 'posts')}
        <Post post={item} />
      {/if}
    {/each}
    <Pageination
      page={data.page}
      on:change={(p) => {
        $page.url.searchParams.set('page', p.detail.toString())
        goto($page.url.toString(), {
          invalidateAll: true,
        })
      }}
    />
  </div>

  <div class="max-w-sm w-full mx-auto">
    <StickyCard class="w-full">
      <Avatar
        width={64}
        url={data.person_view.person.avatar}
        alt={data.person_view.person.name}
      />
      <span class="flex flex-row items-center gap-1 text-sm">
        <Icon src={Calendar} width={16} height={16} mini />
        <span class="capitalize">
          <RelativeDate date={new Date(data.person_view.person.published)} />
        </span>
      </span>
      <div class="text-sm flex flex-row flex-wrap gap-3">
        <span class="flex flex-row items-center gap-1">
          <Icon src={PencilSquare} width={16} height={16} mini />
          <FormattedNumber number={data.person_view.counts.post_count} />
        </span>
        <span class="flex flex-row items-center gap-1">
          <Icon src={ChatBubbleOvalLeftEllipsis} width={16} height={16} mini />
          <FormattedNumber number={data.person_view.counts.comment_count} />
        </span>
      </div>
      {#if $user && $authData && data.person_view.person.id != $user.local_user_view.person.id}
        <div class="flex flex-col gap-2">
          <Button
            size="lg"
            color="danger"
            loading={blocking}
            disabled={blocking}
            on:click={() => blockUser(data.person_view.person.id)}
          >
            <Icon slot="icon" mini size="16" src={NoSymbol} />
            {isBlocked($user, data.person_view.person.id) ? 'Unblock' : 'Block'}
          </Button>
        </div>
      {/if}
      <div>
        <h1 class="font-bold text-lg">
          {data.person_view.person.display_name ?? data.person_view.person.name}
        </h1>
        <span class="text-sm opacity-80 flex flex-row gap-0">
          {#if data.person_view.person.display_name}
            {data.person_view.person.name}@
          {/if}
          {new URL(data.person_view.person.actor_id).hostname}
        </span>
      </div>
      {#if data.person_view.person.bio}
        <Markdown source={data.person_view.person.bio} />
      {/if}
    </StickyCard>
  </div>
</div>
