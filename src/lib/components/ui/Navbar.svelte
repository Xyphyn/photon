<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import { instance_url } from '$lib/lemmy.js'
</script>

<nav
  class="flex top-0 z-20 flex-row gap-4 items-center mt-2 w-full h-16
    max-w-5xl mx-auto px-6"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      <Logo width={40} />
      <div class="flex flex-col">
        <span class="font-bold">Xylemmy</span>
        {#if $instance_url}
          <a
            class="text-xs opacity-50 hover:opacity-100 hover:underline
            transition-opacity"
            href="/instance"
          >
            {new URL(`https://${$instance_url}`).hostname}
          </a>
        {/if}
      </div>
    </a>
  </div>
  <Link href="/communities">Communities</Link>
  <div
    class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100 dark:bg-zinc-800"
  />
</nav>
