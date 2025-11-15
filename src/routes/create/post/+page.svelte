<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { t } from '$lib/app/i18n'
  import { getSessionStorage, setSessionStorage } from '$lib/app/session'
  import PostForm from '$lib/feature/post/form/PostForm.svelte'
  import {
    PostFormState,
    type PostFormInit,
  } from '$lib/feature/post/form/postform.svelte.js'
  import { postLink } from '$lib/feature/post/helpers.js'
  import { onDestroy } from 'svelte'

  let { data } = $props()

  let community = getSessionStorage('lastSeenCommunity') as
    | { id: number; name: string }
    | undefined

  onDestroy(() => {
    setSessionStorage('lastSeenCommunity', undefined)
  })

  let crosspost = $derived.by<PostFormInit>(() => {
    return JSON.parse(
      atob(page.url.searchParams.get('crosspost') ?? '') || '{}',
    )
  })
</script>

<svelte:head>
  <title>{$t('form.post.create')}</title>
</svelte:head>

<PostForm
  init={new PostFormState(crosspost)}
  onsubmit={(post) => goto(postLink(post.post))}
>
  {#snippet title()}{/snippet}
</PostForm>

<!-- <PostFormOld
  passedData={data.crosspost == true
    ? post
    : {
        body: '',
        community: null,
        image: null,
        loading: false,
        nsfw: false,
        title: '',
        url: undefined,
        flair_list: [],
      }}
  passedCommunity={community}
  onsubmit={(e) => goto(`/post/${e.post.id}`)}
>
  {#snippet formtitle()}{/snippet}
</PostFormOld> -->
