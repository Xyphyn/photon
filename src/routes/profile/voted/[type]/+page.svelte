<script lang="ts">
  import { CommentItem } from '$lib/components/lemmy/comment'
  import { PostItem } from '$lib/components/lemmy/post'
  import Fixate from '$lib/components/ui/generic/Fixate.svelte'
  import { CommonList, Header, Pageination } from '$lib/components/ui/layout'
  import { t } from '$lib/i18n/translations.js'
  import { isCommentView } from '$lib/lemmy/item.js'

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
