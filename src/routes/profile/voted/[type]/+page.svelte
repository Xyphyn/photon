<script lang="ts">
  import { browser } from '$app/environment'
  import { PostFeed, VirtualFeed } from '$lib/components/lemmy/post'
  import { Header } from '$lib/components/ui/layout'
  import { t } from '$lib/i18n/translations.js'

  let { data = $bindable() } = $props()

  const SvelteComponent = $derived(browser ? VirtualFeed : PostFeed)
</script>

<Header>
  {data.upvoted ? $t('routes.profile.upvoted') : $t('routes.profile.downvoted')}
</Header>

<SvelteComponent
  posts={data.feed.posts.posts}
  bind:feedData={data.feed}
  feedId="main"
/>
