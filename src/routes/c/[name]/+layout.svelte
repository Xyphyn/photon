<script lang="ts">
    import type { GetCommunityResponse } from 'lemmy-js-client'

    export let data: Promise<GetCommunityResponse>
</script>

{#await data then data}
    <div class="flex flex-col gap-4">
        <div class="flex flex-row gap-4 items-center">
            <img
                src={data.community_view.community.icon}
                alt="test"
                class="rounded-full bg-white border-slate-200 border p-2"
                width={64}
                height={64}
            />
            <h1 class="font-bold text-xl">
                {data.community_view.community.name}
            </h1>
        </div>
        <slot />
    </div>
{/await}
