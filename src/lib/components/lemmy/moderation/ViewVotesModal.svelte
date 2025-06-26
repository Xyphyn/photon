<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { client } from '$lib/lemmy.svelte'
  import { isCommentView, isPostView } from '$lib/lemmy/item'
  import type { CommentView, PostView, VoteView } from 'lemmy-js-client'
  import { Button, Modal, Spinner } from 'mono-svelte'
  import {
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronLeft,
    ChevronRight,
    Icon,
    Newspaper,
  } from 'svelte-hero-icons'
  import UserLink from '../user/UserLink.svelte'

  interface Props {
    open: boolean
    item?: PostView | CommentView | undefined
  }

  let { open = $bindable(), item = $bindable() }: Props = $props()

  let page = $state(1)

  async function loadVotes(page: number): Promise<VoteView[]> {
    if (!item) return []

    if (isPostView(item))
      return await client()
        .listPostLikes({ post_id: item.post.id, limit: 50, page: page })
        .then(i => i.post_likes)
    if (isCommentView(item))
      return await client()
        .listCommentLikes({
          comment_id: item.comment.id,
          limit: 50,
          page: page,
        })
        .then(i => i.comment_likes)

    return []
  }

  let votes: Promise<VoteView[]> = $derived(loadVotes(page))
</script>

<Modal bind:open title={$t('moderation.votes')}>
  <div class="flex flex-col gap-1">
    {#await votes}
      <div class="self-center justify-self-center h-48 grid place-items-center">
        <Spinner width={24} />
      </div>
    {:then votes}
      <table class="w-full border-collapse overflow-y-auto table-fixed">
        <thead>
          <tr
            class="border divide-x divide-slate-200 dark:divide-zinc-800 border-slate-200 dark:border-zinc-800 *:px-4 *:py-2"
          >
            <th style="width: 6%;"></th>
            <th style="width: 60%;" class="text-left">
              {$t('routes.admin.applications.user')}
            </th>
            <th style="width: 5%;"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-zinc-800">
          {#each votes as vote}
            <tr>
              <td class="py-1 px-1 w-full">
                <Icon
                  src={vote.score == 1 ? ArrowUpCircle : ArrowDownCircle}
                  mini
                  size="20"
                  class={vote.score == 1 ? 'text-blue-400' : 'text-red-400'}
                  aria-label={vote.score == 1
                    ? $t('routes.profile.upvoted')
                    : $t('routes.profile.downvoted')}
                />
              </td>
              <td class="text-sm w-full overflow-hidden">
                <UserLink
                  user={{
                    ...vote.creator,
                    banned: vote.creator_banned_from_community,
                  }}
                />
              </td>
              <td class="text-sm w-full text-right">
                <a
                  href="/modlog?user={vote.creator.id}"
                  data-sveltekit-preload-data="tap"
                  class="text-green-400 hover:underline flex flex-row items-center gap-1 font-medium text-xs"
                  aria-label={$t('moderation.modlog.user')}
                >
                  <Icon src={Newspaper} size="18" micro />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if !(votes.length < 50 && page == 1)}
        <div class="flex flex-row justify-center items-center gap-2">
          <Button
            onclick={() => page--}
            color="ghost"
            aria-label={$t('common.back')}
            rounding="pill"
            size="square-md"
            disabled={page == 1}
          >
            <Icon src={ChevronLeft} size="20" mini />
          </Button>
          {page}
          <Button
            onclick={() => page++}
            color="ghost"
            aria-label={$t('common.next')}
            rounding="pill"
            size="square-md"
            disabled={votes.length < 50}
          >
            <Icon src={ChevronRight} size="20" mini />
          </Button>
        </div>
      {/if}
    {/await}
  </div>
</Modal>
