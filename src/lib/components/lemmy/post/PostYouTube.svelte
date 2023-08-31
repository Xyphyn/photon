<script lang="ts">
    import Link from '$lib/components/input/Link.svelte'
    import { userSettings } from '$lib/settings.js'
    export let url: string

    let videoID:  string|boolean = false
    let embedURL: string|boolean = false
    
    // Parse URLs to pick out video IDs to create embed URLs
    // YouTube
    if (url.includes('youtu.be') || url.includes('youtube.com')) {
        videoID = new URL(url).pathname.replace('/','')
        //embedURL = "https://piped.video/embed";
        embedURL = "https://www.youtube-nocookie.com/embed";
        
        if (videoID == "watch") {
            videoID = new URL(url).searchParams.get('v');
        }
        embedURL += `/${videoID}`
    }

    
    // Invidious
    if (url.includes('vid.puffyan.us')) {
        embedURL = "https://vid.puffyan.us/embed";
        videoID = new URL(url).searchParams.get('v');
        embedURL += `/${videoID}`
    }

    // Spotify
    // https://open.spotify.com/embed/track/2RUs0cO0KpvuZJ0J4hqFFC
    if (url.includes('open.spotify.com/embed')) {
        embedURL = url;
    }

    if (url.includes('open.spotify.com/track')) {
        let trackID = new URL(url).pathname.replace('/track/','');
        embedURL = `https://open.spotify.com/embed/track/${trackID}?theme=0`
    }

    if (url.includes('open.spotify.com/playlist')) {
        let trackID = new URL(url).pathname.replace('/playlist/','');
        embedURL = `https://open.spotify.com/embed/playlist/${trackID}?theme=0`
    }

    if (url.includes('open.spotify.com/album')) {
        let trackID = new URL(url).pathname.replace('/album/','');
        embedURL = `https://open.spotify.com/embed/album/${trackID}?theme=0`
    }


    
    
    let extraParams = ""
    if (videoID) {
        // Start time
        // Can be either t (legacy) or start
        let startTime = new URL(url).searchParams.get('t');
        if (!startTime) {
            startTime = new URL(url).searchParams.get('start');
        }
        
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

{#if $userSettings.showEmbeds && embedURL}

<div class="overflow-hidden z-10 relative bg-slate-200 dark:bg-zinc-800 rounded-md max-w-full">
    <div class="ml-auto mr-auto mt-1 mb-1 max-w-4xl">
        <div class="iframe-container rounded-md max-w-screen max-h-[480px] mx-auto">
            <iframe 
                class="flexiframe"
                src="{embedURL}?{extraParams}" 
                allow="accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                loading="lazy"
                allowfullscreen 
            >
            </iframe>
        </div>
    </div>
</div>
{/if}