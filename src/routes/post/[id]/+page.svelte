<script lang="ts">
    import MultiSelect from '$lib/components/MultiSelect.svelte'
    import type { GetCommentsResponse, GetPostResponse } from 'lemmy-js-client'

    export let data: { post: GetPostResponse; comments: GetCommentsResponse }

    const postData = data.post.post_view
    const post = postData.post

    const comments = data.comments.comments
</script>

<div class="flex flex-col gap-2">
    <span class="flex flex-row gap-2 text-sm opacity-70">
        <a href="/">c/{postData.community.name}</a>
        <span class="opacity-50">{postData.creator.name}</span>
    </span>
    <h1 class="font-bold text-lg">{post.name}</h1>
    {#if post.thumbnail_url}
        <img src={post.thumbnail_url} alt={post.name} />
    {/if}
    {#if post.body}
        <p>{post.body}</p>
    {/if}
</div>
<div class="mt-4 flex flex-col gap-2">
    <div class="font-bold text-lg">Comments</div>
    <MultiSelect
        options={['hot', 'new', 'top']}
        optionNames={['Hot', 'New', 'Top']}
        selected="hot"
    />
</div>
{#each comments as comment}
    {comment.comment.content}
{/each}
