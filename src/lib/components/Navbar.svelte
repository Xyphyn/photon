<script lang="ts">
  import Link from '$lib/components/Link.svelte'
  import Logo from '$lib/components/Logo.svelte'
</script>

<nav
  class="flex top-0 z-20 flex-row gap-4 items-center mt-2 w-full h-16
    max-w-5xl mx-auto px-6"
>
  <div class="flex flex-row gap-2 items-center mr-auto">
    <a href="/" class="flex flex-row items-center gap-2">
      <Logo width={40} />
      <span class="font-bold">Xylemmy</span>
    </a>
  </div>
  <Link href="/communities">Communities</Link>
  <div
    class="w-8 h-8 rounded-full ring-1 ring-slate-300 bg-slate-100 dark:bg-zinc-800"
  />
</nav>
