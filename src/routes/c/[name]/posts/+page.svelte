<script lang="ts">
    import MultiSelect from '$lib/components/MultiSelect.svelte'
    import type { PostResponse } from 'lemmy-js-client'
    import Post from './Post.svelte'

    export let data: any
</script>

<MultiSelect options={['Community', 'idk']} selected="Community" />

<div class="flex flex-col gap-4">
    {#await data then data}
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
        {#each data?.posts as post}
            <Post {post} />
        {/each}
    {/await}
</div>
