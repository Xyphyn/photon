<script lang="ts">
  import { t } from '$lib/app/i18n'
  import CommentItem from '$lib/feature/comment/CommentItem.svelte'
  import { isCommentView } from '$lib/feature/legacy/item'
  import { PostItem } from '$lib/feature/post'
  import Fixate from '$lib/ui/generic/Fixate.svelte'
  import { CommonList, Header, Pageination } from '$lib/ui/layout'

  let { data = $bindable() } = $props()
</script>

<Header pageHeader>
  {data.upvoted ? $t('routes.profile.upvoted') : $t('routes.profile.downvoted')}
</Header>

<CommonList items={data.items}>
  {#snippet item(item)}
    {#if isCommentView(item)}
      <CommentItem comment={item} />
    {:else if !isCommentView(item)}
      <PostItem post={item} />
    {/if}
  {/snippet}
</CommonList>

<Fixate placement="bottom">
  <Pageination
    bind:page={data.filters.value.page}
    href={(page) => `?page=${page}`}
  />
</Fixate>
