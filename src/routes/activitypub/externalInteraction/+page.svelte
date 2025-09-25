<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { Spinner } from 'mono-svelte'
  import type { ResolveObjectResponse } from '$lib/api/types'
  import UserItem from '$comp/lemmy/user/UserItem.svelte'
  import { PostItem } from '$comp/lemmy/post'
  import CommunityItem from '$comp/lemmy/community/CommunityItem.svelte'
  import CommentItem from '$comp/lemmy/comment/CommentItem.svelte'

  interface Props {
    data: {
      resolved: Promise<ResolveObjectResponse>
    }
  }

  let { data }: Props = $props()
</script>

<div class="flex flex-col items-center justify-center h-full gap-3">
  {#await data.resolved}
    <Spinner width={32} />
    <span class="font-medium text-lg">{$t('routes.search.federating')}...</span>
  {:then object}
    <div class="w-full max-w-md">
      {#if object.community}
        <CommunityItem bind:community={object.community} />
      {:else if object.person}
        <UserItem user={object.person} />
      {:else if object.post}
        <PostItem post={object.post} />
      {:else if object.comment}
        <CommentItem comment={object.comment} />
      {/if}
    </div>
  {/await}
</div>
