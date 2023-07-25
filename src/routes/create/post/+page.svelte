<script lang="ts">
  import { goto } from '$app/navigation'
  import PostForm from '$lib/components/lemmy/post/PostForm.svelte'
  import Card from '$lib/components/ui/Card.svelte'
</script>

<svelte:head>
  <title>Create post</title>
</svelte:head>

<Card class="p-6 max-w-2xl mx-auto">
  <PostForm on:submit={(e) => goto(`/post/${e.detail.post.id}`)} />
</Card>
