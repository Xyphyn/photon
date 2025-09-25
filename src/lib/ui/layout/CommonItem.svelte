<script lang="ts">
  import type { Snippet } from 'svelte'
  import Avatar from '../generic/Avatar.svelte'

  interface Props {
    href?: string
    icon?: string
    title: string
    detail?: string
    orientation?: 'vertical' | 'horizontal'
    children?: Snippet
  }

  let {
    href,
    icon,
    title,
    detail,
    children,
    orientation = 'horizontal',
  }: Props = $props()
</script>

<div
  class={[
    'flex gap-2 p-5',
    orientation == 'horizontal'
      ? 'flex-row items-center'
      : 'flex-col items-staRT',
  ]}
>
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
  <div class="flex flex-row gap-2 items-center">
    {@render children?.()}
  </div>
</div>
