<script lang="ts">
  import { Icon, Link } from 'svelte-hero-icons'

  export let url: string
  export let thumbnail_url: string
  export let nsfw: boolean = false
</script>

<a href={url} class="self-start relative group" class:blur-3xl={nsfw}>
  <!-- svelte-ignore a11y-missing-attribute -->
  <img
    src={thumbnail_url}
    class="rounded-md w-[500px] aspect-video object-cover bg-slate-200 dark:bg-zinc-800"
    width={600}
    height={400}
  />
  <span
    class="w-full px-4 py-1.5 overflow-hidden whitespace-nowrap text-ellipsis
        text-sm group-hover:underline bg-slate-100 border dark:border-zinc-800
        dark:bg-zinc-900 absolute bottom-0 rounded-b-md flex flex-row gap-1
        items-center h-9 text-slate-700 dark:text-zinc-400"
  >
    <Icon src={Link} width={16} mini class="" />
    {new URL(url).hostname}
  </span>
</a>
