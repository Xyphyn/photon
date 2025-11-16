<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import type { CommunityView } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { getSessionStorage, setSessionStorage } from '$lib/app/session'
  import PostForm from '$lib/feature/post/form/PostForm.svelte'
  import {
    PostFormState,
    type PostFormInit,
  } from '$lib/feature/post/form/postform.svelte.js'
  import { postLink } from '$lib/feature/post/helpers.js'
  import { onDestroy } from 'svelte'

  let community = getSessionStorage('lastSeenCommunity') as
    | CommunityView
    | undefined

  onDestroy(() => {
    setSessionStorage('lastSeenCommunity', undefined)
  })

  let crosspost = $derived.by<PostFormInit>(() => {
    const crosspostParam = page.url.searchParams.get('crosspost')
    try {
      return crosspostParam
        ? JSON.parse(atob(crosspostParam) || '{}')
        : undefined
    } catch {
      return undefined
    }
  })
</script>

<svelte:head>
  <title>{$t('form.post.create')}</title>
</svelte:head>

<PostForm
  init={crosspost
    ? new PostFormState(crosspost)
    : community
      ? new PostFormState({ community: community?.community })
      : undefined}
  onsubmit={(post) => goto(postLink(post.post))}
>
  {#snippet title()}{/snippet}
</PostForm>
