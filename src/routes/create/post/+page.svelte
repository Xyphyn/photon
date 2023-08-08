<script lang="ts">
  import { goto } from '$app/navigation'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { profile } from '$lib/auth.js'
  import { onMount } from 'svelte'
  import { getSessionStorage } from '$lib/session.js'

  onMount(() => {
    if (!$profile?.jwt) {
      goto('/login')
    }
  })

  let community = getSessionStorage('lastSeenCommunity') as
    | { id: number; name: string }
    | undefined
</script>

<svelte:head>
  <title>Create post</title>
</svelte:head>

<Card class="p-6 max-w-2xl mx-auto">
  <PostForm
    passedCommunity={community}
    on:submit={(e) => goto(`/post/${e.detail.post.id}`)}
  />
</Card>
