<script lang="ts">
  import { browser } from '$app/environment'
  import { navigating, page } from '$app/state'
  import { profile } from '$lib/auth.svelte.js'
  import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
  import CommunityHeader from '$lib/components/lemmy/community/CommunityHeader.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import PostFeed from '$lib/components/lemmy/post/feed/PostFeed.svelte'
  import VirtualFeed from '$lib/components/lemmy/post/feed/VirtualFeed.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Pageination from '$lib/components/ui/Pageination.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { site } from '$lib/client/client.svelte.js'
  import { resumables } from '$lib/lemmy/item'
  import { setSessionStorage } from '$lib/session.js'
  import { settings } from '$lib/settings.svelte.js'
  import { Badge, Button, Modal, Note } from 'mono-svelte'
  import { onDestroy, onMount } from 'svelte'
  import { ArrowRight, ChartBar, Icon, Plus, XMark } from 'svelte-hero-icons'

  let { data } = $props()

  let sidebar: boolean = $state(false)

  onMount(() => {
    if (browser)
      setSessionStorage(
        'lastSeenCommunity',
        data.community.value.community_view.community,
      )

    resumables.add({
      name: data.community.value.community_view.community.title,
      type: 'community',
      url: page.url.toString(),
      avatar: data.community.value.community_view.community.icon,
    })
  })

  onDestroy(() => {
    if (browser) {
      if (navigating?.to?.route?.id == '/create/post') return

      setSessionStorage('lastSeenCommunity', undefined)
    }
  })
</script>

{#if sidebar}
  <Modal bind:open={sidebar}>
    {#snippet customTitle()}
      <span>About</span>
    {/snippet}
    <div>
      <CommunityCard
        bind:community_view={data.community.value.community_view}
        moderators={data.community.value.moderators}
      />
    </div>
  </Modal>
{/if}

<div class="flex flex-col gap-4 max-w-full w-full min-w-0">
  <Header pageHeader>
    <div class="flex flex-col w-full">
      <CommunityHeader
        bind:community={data.community.value.community_view.community}
        bind:subscribed={data.community.value.community_view.subscribed}
        blocked={data.community.value.community_view.blocked}
        moderators={data.community.value.moderators}
        counts={data.community.value.community_view.counts}
        class="w-full relative"
      />
    </div>
    {#snippet extended()}
      <Sort selected={data.sort} />
    {/snippet}
  </Header>

  {#if profile.data.user}
    {#if !data.community.value.discussion_languages.every( l => profile.data.user?.discussion_languages.includes(l), ) && profile.data.user.discussion_languages.length > 0}
      {@const missing = data.community.value.discussion_languages.filter(
        i => !profile.data.user?.discussion_languages.includes(i),
      )}
      <Note class="p-1! pl-3! flex-col md:flex-row">
        <div>{$t('routes.community.languageWarning')}</div>
        <Button
          class="inline-block ml-auto"
          href="/profile/settings"
          color="tertiary"
          rounding="pill"
          size="md"
        >
          {$t('profile.profile')}
          {#snippet suffix()}
            <Icon src={ArrowRight} size="16" micro />
          {/snippet}
        </Button>
      </Note>
      <div class="flex flex-row gap-4 flex-wrap -mt-2">
        {#if site.data?.all_languages}
          {@const allLanguages = site.data.all_languages}
          {#each missing as language (language)}
            <a href="/profile/settings#languages" class="inline-block w-max">
              <Badge color="blue-subtle">
                <Icon src={Plus} size="16" micro />
                {allLanguages.find(i => language == i.id)?.name}
              </Badge>
            </a>
          {/each}
        {/if}
      </div>
    {/if}
  {/if}

  {#if data.community.value.community_view.blocked}
    <Placeholder
      icon={XMark}
      title="Blocked"
      description="You've blocked this community."
    >
      <Button href="/profile/blocks">
        {#snippet suffix()}
          <Icon src={ArrowRight} size="16" mini />
        {/snippet}
        Blocked Communities
      </Button>
    </Placeholder>
  {:else}
    {@const SvelteComponent = browser ? VirtualFeed : PostFeed}
    <SvelteComponent
      posts={data.posts.posts}
      bind:feedData={data}
      feedId="community"
      community
    />
  {/if}

  <svelte:element
    this={settings.infiniteScroll ? 'noscript' : 'div'}
    class="mt-auto"
  >
    <Pageination
      page={data.page}
      cursor={{ next: data.cursor.next }}
      href={page =>
        typeof page == 'number' ? `?page=${page}` : `?cursor=${page}`}
    >
      <span class="flex flex-row items-center gap-1">
        <Icon src={ChartBar} size="16" mini />
        {$t('routes.frontpage.footer', {
          users:
            data.community.value.community_view.counts.users_active_day ?? '??',
        })}
      </span>
    </Pageination>
  </svelte:element>
</div>

<style>
</style>
