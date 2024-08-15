<script lang="ts">
  import { goto } from '$app/navigation'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import { profile } from '$lib/auth.js'
  import { onDestroy, onMount } from 'svelte'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'
  import { t } from '$lib/translations.js'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'

  export let data = {
    crosspost: false,
  }

  onMount(() => {
    if (!$profile?.jwt) {
      goto('/login')
    }
  })

  let community = getSessionStorage('lastSeenCommunity') as
    | { id: number; name: string }
    | undefined

  onDestroy(() => {
    setSessionStorage('lastSeenCommunity', undefined)
  })

  let draft = getSessionStorage('postDraft') as any
</script>

<svelte:head>
  <title>{$t('form.post.create')}</title>
</svelte:head>

<div class="w-full max-w-5xl mx-auto h-full">
  <PostForm
    data={data.crosspost == true
      ? draft
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
    on:submit={(e) => goto(`/post/${e.detail.post.id}`)}
  >
    <Header class="text-3xl font-bold" slot="formtitle" pageHeader>
      {$t('routes.createPost')}
    </Header>
  </PostForm>
</div>
