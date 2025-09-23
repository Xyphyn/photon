<script lang="ts">
  import { CommonList } from '$comp/ui/layout'
  import FeedItem from './FeedItem.svelte'

  let { data } = $props()
</script>

<CommonList items={data.feeds.value}>
  {#snippet item(feed)}
    <FeedItem {feed} />
  {/snippet}
</CommonList>
