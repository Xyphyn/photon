<script lang="ts" context="module">
  const sources: {
    getLink: (url: string) => string
    name: string
    type: MediaType
  }[] = [
    {
      getLink: (url: string) =>
        `https://archive.ph/${encodeURIComponent(url.split('?')[0])}`,
      name: 'Archive Today',
      type: 'embed',
    },
    {
      getLink: (url: string) =>
        `https://ghostarchive.org/search?term=${encodeURIComponent(url.split('?')[0])}`,
      name: 'Ghost Archive',
      type: 'embed',
    },
    {
      getLink: (url: string) =>
        `https://12ft.io/proxy?q=${encodeURIComponent(url.split('?')[0])}`,
      name: '12ft.io',
      type: 'embed',
    },
    {
      getLink: (url: string) =>
        `https://ground.news/find?url=${encodeURIComponent(url.split('?')[0])}`,
      name: 'Ground News',
      type: 'embed',
    },
  ]
</script>

<script lang="ts">
  import { t } from '$lib/translations'
  import { Menu, MenuButton, MenuDivider } from 'mono-svelte'
  import type { MediaType } from '../helpers'
  import { CheckBadge, Icon } from 'svelte-hero-icons'

  export let url: string
  export let type: MediaType = 'embed'

  let mediaBias = false

  const stripSubdomain = (url: string) =>
    new URL(url).hostname.split('.').slice(-2).join('.')
</script>

{#if mediaBias}
  {#await import('$lib/components/mbfc/MBFCModal.svelte') then { default: MbfcModal }}
    <MbfcModal domain={stripSubdomain(url)} bind:open={mediaBias} />
  {/await}
{/if}

<Menu {...$$restProps}>
  <slot name="target" slot="target" />

  <MenuDivider>{$t('post.actions.link.title')}</MenuDivider>
  {#each sources as source}
    {#if source.type == type}
      <MenuButton target="_blank" href={source.getLink(url)}>
        {source.name}
      </MenuButton>
    {/if}
  {/each}
  <MenuDivider>{$t('post.actions.link.actions')}</MenuDivider>
  <MenuButton on:click={() => (mediaBias = !mediaBias)}>
    <Icon src={CheckBadge} size="16" micro slot="prefix" />
    {$t('post.actions.more.mediaBias')}
  </MenuButton>
</Menu>
