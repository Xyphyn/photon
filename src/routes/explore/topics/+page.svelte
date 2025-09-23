<script lang="ts">
  import { CommonList } from '$comp/ui/layout'
  import TopicItem from './TopicItem.svelte'

  let { data } = $props()
</script>

<CommonList items={data.topics.value}>
  {#snippet item(topic)}
    <TopicItem {topic} />
  {/snippet}
</CommonList>
