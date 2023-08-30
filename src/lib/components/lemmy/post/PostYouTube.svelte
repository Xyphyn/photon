<script lang="ts">
    import Link from '$lib/components/input/Link.svelte'
    export let url: string

    let videoID: string|boolean = false

    if (url.includes('youtu.be')) {
        videoID = new URL(url).pathname.replace('/','')
    }
    else if (url.includes('youtube.com')) {
        videoID = new URL(url).searchParams.get('v')    
    }

    let extraParams = "?"
    if (videoID) {
        // Start time
        let startTime = new URL(url).searchParams.get('t');
        if (startTime) {
            extraParams += `&start=${startTime}`
        }
    }
</script>

<style>
    .iframe-container {
        position: relative;
        overflow: hidden;
        padding-top: 56.25%;
    }

    .flexiframe {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border:0;
    }
</style>

<Link href={url} highlight nowrap />

{#if videoID}

<div class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full">
    <div class="ml-auto mr-auto max-w-2xl">
        <div class="iframe-container rounded-md max-w-screen max-h-[480px] mx-auto">
            <iframe 
                class="flexiframe"
                src="https://www.youtube-nocookie.com/embed/{videoID}{extraParams}" 
                allow="accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                loading="lazy"
                allowfullscreen 
            >
            </iframe>
        </div>
    </div>
</div>
{/if}