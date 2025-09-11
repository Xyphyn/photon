<script lang="ts">
  import Tabs from '$lib/components/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { fullCommunityName } from '$lib/util.svelte.js'
  import type { PageData } from './$types.js'

  interface Props {
    data: PageData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  let communityUrl = $derived(
    `/c/${fullCommunityName(
      data.community.value.community_view.community.name,
      data.community.value.community_view.community.actor_id,
    )}`,
  )
</script>

<svelte:head>
  <title>{data.community.value.community_view.community.title}</title>

  <meta
    name="og:title"
    content={data.community.value.community_view.community.title}
  />
  {#if data.community.value.community_view.community.description}
    <meta
      name="og:description"
      content={data.community.value.community_view.community.description}
    />
  {/if}
</svelte:head>

<div class="flex flex-col gap-4 h-full">
  <Tabs
    routes={[
      {
        href: `${communityUrl}/settings`,
        name: $t('routes.community.settings.settings'),
      },
      {
        href: `${communityUrl}/settings/team`,
        name: $t('routes.community.settings.team'),
      },
    ]}
  ></Tabs>
  {@render children?.()}
</div>
