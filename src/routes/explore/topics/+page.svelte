<script lang="ts">
  import { CommonList } from '$lib/ui/layout'
  import TopicItem from './TopicItem.svelte'

  let { data } = $props()
</script>

<CommonList items={data.topics.value}>
  {#snippet item(topic)}
    <TopicItem {topic} />
  {/snippet}
</CommonList>
