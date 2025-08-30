<script lang="ts">
  import { goto } from '$app/navigation'
  import { profile } from '$lib/auth.svelte.js'
  import PostForm from '$lib/components/lemmy/post/form/PostForm.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'
  import { onDestroy, onMount } from 'svelte'

  let { data } = $props()

  onMount(() => {
    if (!profile.current?.jwt) {
      goto('/login')
    }
  })

  let community = getSessionStorage('lastSeenCommunity') as
    | { id: number; name: string }
    | undefined

  onDestroy(() => {
    setSessionStorage('lastSeenCommunity', undefined)
  })

  // TODO remove this

  let post = getSessionStorage('postDraft') as any
</script>

<svelte:head>
  <title>{$t('form.post.create')}</title>
</svelte:head>

<PostForm
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
      }}
  passedCommunity={community}
  onsubmit={e => goto(`/post/${e.post.id}`)}
>
  {#snippet formtitle()}{/snippet}
</PostForm>
