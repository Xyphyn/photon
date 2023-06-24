<script lang="ts">
    import MultiSelect from '$lib/components/MultiSelect.svelte'
    import Post from '../../../post/[id]/Post.svelte'

    export let data
</script>

<MultiSelect options={['Community', 'idk']} selected="Community" />

<div class="flex flex-col gap-4">
    {#each data.posts as post}
        <Post {post} />
    {/each}
</div>
