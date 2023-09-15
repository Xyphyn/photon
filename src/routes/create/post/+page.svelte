<script lang="ts">
  import { goto } from '$app/navigation'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import { profile } from '$lib/auth.js'
  import { onDestroy, onMount } from 'svelte'
  import { getSessionStorage, setSessionStorage } from '$lib/session.js'

  export let data

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
  <title>Create post</title>
</svelte:head>

<div class="w-full max-w-5xl mx-auto h-full">
  <PostForm
    data={data.crosspost ? draft : undefined}
    passedCommunity={community}
    on:submit={(e) => goto(`/post/${e.detail.post.id}`)}
  >
    <h1 class="text-2xl font-bold" slot="formtitle">Create Post</h1>
  </PostForm>
</div>
