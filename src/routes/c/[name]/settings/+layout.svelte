<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { communityLink } from '$lib/app/util.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte'
  import { Tabs } from '$lib/ui/layout'
  import type { PageData } from './$types'

  interface Props {
    data: PageData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  let community = $derived(repos.communities.get(data.community.community_view))
  let link = $derived(communityLink(community.community))
</script>

<svelte:head>
  <title>{community.community.title}</title>

  <meta name="og:title" content={community.community.title} />
  {#if community.community.summary}
    <meta name="og:description" content={community.community.summary} />
  {/if}
</svelte:head>

<Tabs
  routes={[
    {
      href: `${link}/settings`,
      name: $t('routes.community.settings.settings'),
    },
    {
      href: `${link}/settings/team`,
      name: $t('routes.community.settings.team'),
    },
  ]}
></Tabs>
{@render children?.()}
