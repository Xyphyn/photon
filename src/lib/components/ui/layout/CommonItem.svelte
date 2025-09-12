<script lang="ts">
  import type { Snippet } from 'svelte'
  import Avatar from '../Avatar.svelte'

  interface Props {
    href?: string
    icon?: string
    title: string
    detail?: string
    children?: Snippet
  }

  let { href, icon, title, detail, children }: Props = $props()
</script>

<div class="flex flex-row gap-2 items-center">
  <Avatar url={icon} alt={title} width={detail ? 32 : 24} circle={false} />
  <a class="flex-1 flex flex-col group" {href}>
    <h3
      class="font-medium text-base overflow-hidden text-ellipsis leading-5 group-hover:underline"
    >
      {title}
    </h3>
    <p class="text-sm text-slate-600 dark:text-zinc-400">
      {detail}
    </p>
  </a>
  {@render children?.()}
</div>
