<script lang="ts">
  import type { TopicView } from '$lib/client/types'
  import CommonItem from '$lib/components/ui/layout/CommonItem.svelte'

  interface Props {
    topic: TopicView
  }

  let { topic }: Props = $props()
</script>

<CommonItem title={topic.title ?? topic.name} href="/topic/{topic.id}" />
