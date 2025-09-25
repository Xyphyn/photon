<script lang="ts">
  import { browser } from '$app/environment'
  import { navigating, page } from '$app/state'
  import { profile } from '$lib/app/auth.svelte.js'
  import { site } from '$lib/api/client.svelte.js'
  import CommunityHeader from '$comp/lemmy/community/CommunityHeader.svelte'
  import { PostListShell } from '$comp/ui/layout'
  import { t } from '$lib/app/i18n/index.js'
  import { resumables } from '$lib/lemmy/item'
  import { setSessionStorage } from '$lib/session.js'
  import { Badge, Button, Note } from 'mono-svelte'
  import { onDestroy, onMount } from 'svelte'
  import { ArrowRight, Icon, Plus } from 'svelte-hero-icons'

  let { data } = $props()

  onMount(() => {
    if (browser)
      setSessionStorage('lastSeenCommunity', data.community.community_view)

    resumables.add({
      name: data.community.community_view.community.title,
      type: 'community',
      url: page.url.toString(),
      avatar: data.community.community_view.community.icon,
    })
  })

  onDestroy(() => {
    if (browser) {
      if (navigating?.to?.route?.id == '/create/post') return

      setSessionStorage('lastSeenCommunity', undefined)
    }
  })
</script>

<svelte:head>
  <title>{data.community.community_view.community.title}</title>

  <meta
    name="og:title"
    content={data.community.community_view.community.title}
  />
  {#if data.community.community_view.community.description}
    <meta
      name="og:description"
      content={data.community.community_view.community.description}
    />
  {/if}
</svelte:head>

<PostListShell
  bind:posts={data.posts}
  bind:cursor={data.next_page}
  bind:client={data.client}
  getParams={data.params}
  params={{
    sort: data.params.sort!,
  }}
>
  {#snippet extended()}
    <CommunityHeader
      bind:community={data.community.community_view.community}
      bind:subscribed={data.community.community_view.subscribed}
      blocked={data.community.community_view.blocked}
      moderators={data.community.moderators}
      counts={data.community.community_view.counts}
      class="w-full relative"
      compact="lg"
      avatarCircle={false}
    />
    {#if data.community.community_view.blocked}
      <Note>You've blocked this community.</Note>
    {/if}
    {#if profile.current.user}
      {#if !data.community.discussion_languages.every( (l) => profile.current.user?.discussion_languages.includes(l), ) && profile.current.user.discussion_languages.length > 0}
        {@const missing = data.community.discussion_languages.filter(
          (i) => !profile.current.user?.discussion_languages.includes(i),
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
                  {allLanguages.find((i) => language == i.id)?.name}
                </Badge>
              </a>
            {/each}
          {/if}
        </div>
      {/if}
    {/if}
  {/snippet}
</PostListShell>
