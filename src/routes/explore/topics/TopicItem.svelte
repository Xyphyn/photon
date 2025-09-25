<script lang="ts">
  import type { TopicView } from '$lib/api/types'
  import CommonItem from '$comp/ui/layout/CommonItem.svelte'

  interface Props {
    topic: TopicView
  }

  let { topic }: Props = $props()
</script>

<CommonItem title={topic.title ?? topic.name} href="/topic/{topic.id}" />
