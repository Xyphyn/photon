<script lang="ts">
  import type { FeedView } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import Entity from '$lib/ui/generic/Entity.svelte'
  import LabelStat from '$lib/ui/info/LabelStat.svelte'
  import CommonItem from '$lib/ui/layout/CommonItem.svelte'
  import { Button, modal } from 'mono-svelte'
  import { InformationCircle } from 'svelte-hero-icons/dist'

  interface Props {
    feed: FeedView
  }

  let { feed }: Props = $props()
</script>

{#snippet feedModal()}
  <Entity icon={feed.icon} name={feed.title} label={feed.name}></Entity>
  <Markdown source={feed.description} />
  <LabelStat
    label={$t('cards.community.members')}
    content={feed.subscriptions_count}
  />
{/snippet}

<CommonItem
  icon={feed.icon}
  title={feed.title}
  detail="{feed.name} • {feed.subscriptions_count}"
  href="/f/{feed.id}"
>
  <Button
    onclick={() => modal({ title: $t('common.info'), snippet: feedModal })}
    color="ghost"
    size="custom"
    rounding="xl"
    class="h-8.5 aspect-square"
    icon={InformationCircle}
    aria-label={$t('common.info')}
  />
</CommonItem>
