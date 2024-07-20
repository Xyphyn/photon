<script lang="ts">
  import { page } from '$app/stores'
  import { fly } from 'svelte/transition'

  export let routes: {
    href: string
    name: string
  }[]
</script>

<nav
  class="flex flex-row items-center gap-1 p-1 rounded-full bg-[#fff]/60 dark:bg-neutral-800/60
  backdrop-blur-lg border border-gray-200/60 dark:border-neutral-800 shadow-lg {$$props.class ??
    ''}
  "
>
  {#each routes as route}
    <a
      href={route.href}
      class="font-medium rounded-full px-4 py-1 hover:bg-gray-200/40 hover:dark:bg-neutral-700/40
      transition-colors duration-100 relative z-0"
    >
      {route.name}
      {#if $page.url.pathname == route.href}
        <div
          class="rounded-full bg-gray-100/60 dark:bg-neutral-700/60
          absolute inset-0 w-full h-full -z-10"
        ></div>
      {/if}
    </a>
  {/each}
  <slot />
</nav>
