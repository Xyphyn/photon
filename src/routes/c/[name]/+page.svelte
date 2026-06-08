<script lang="ts">
  import { browser } from '$app/environment'
  import { navigating, page } from '$app/state'
  import { site } from '$lib/api/client.svelte'
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { setSessionStorage } from '$lib/app/session'
  import CommunityHeader from '$lib/feature/community/CommunityHeader.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte.js'
  import { resumables } from '$lib/feature/legacy/item'
  import { PostListShell } from '$lib/ui/layout'
  import { Badge, Button, Note } from 'mono-svelte'
  import { onDestroy, onMount } from 'svelte'
  import { ArrowRight, Icon, Plus } from 'svelte-hero-icons/dist'

  let { data } = $props()

  let community = $derived(repos.communities.get(data.community.community_view))

  onMount(() => {
    if (browser) setSessionStorage('lastSeenCommunity', community.data)

    resumables.add({
      name: community.community.name,
      type: 'community',
      url: page.url.toString(),
      avatar: community.community.icon,
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
  <title>{community.community.title}</title>

  <meta name="og:title" content={community.community.title} />
  {#if community.community.summary}
    <meta name="og:description" content={community.community.summary} />
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
      bind:community={community.community}
      bind:subscribed={community.subscribed}
      blocked={community.blocked}
      moderators={data.community.moderators}
      class="w-full relative"
      compact="lg"
      avatarCircle={false}
    />
    {#if community.blocked}
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
