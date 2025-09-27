<script lang="ts">
  import { CommonList } from '$lib/ui/layout'
  import FeedItem from './FeedItem.svelte'

  let { data } = $props()
</script>

<CommonList items={data.feeds.value}>
  {#snippet item(feed)}
    <FeedItem {feed} />
  {/snippet}
</CommonList>
