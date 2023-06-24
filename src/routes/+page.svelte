<script lang="ts">
    import Link from '$lib/components/Link.svelte'

    let community = ''
</script>

<input bind:value={community} placeholder="Community name" />
<div class="w-max">
    <Link href="/c/{community}">Go</Link>
</div>
