<script lang="ts">
    import Logo from '$lib/components/Logo.svelte'

    export let routes: string[] = []
</script>

<nav
    class="flex top-0 z-20 flex-row gap-4 items-center mt-2 w-full h-16
    max-w-5xl mx-auto px-6"
>
    <div class="flex flex-row gap-2 items-center mr-auto">
        <a href="/">
            <Logo width={40} />
        </a>
        {#if routes.length != 0}
            {#each routes as route}
                <svg
                    fill="none"
                    height="32"
                    viewBox="0 0 24 24"
                    width="32"
                    class="stroke-1 opacity-20 stroke-black dark:stroke-white"
                >
                    <path d="M16.88 3.549L7.12 20.451" />
                </svg>
                <span>{route}</span>
            {/each}
        {/if}
    </div>
    <div
        class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100 dark:bg-zinc-800"
    />
</nav>
