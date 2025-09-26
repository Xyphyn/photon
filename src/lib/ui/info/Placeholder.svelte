<script lang="ts">
  import { type IconSource, Icon } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    icon?: IconSource | undefined
    title: string
    description?: string | undefined
    class?: ClassValue
    children?: import('svelte').Snippet
    iconClass?: ClassValue
  }

  let {
    icon = undefined,
    title,
    description = undefined,
    class: clazz = '',
    children,
    iconClass,
  }: Props = $props()
</script>

<div
  class="text-slate-500 dark:text-zinc-500 contrast-more:text-slate-700 contrast-more:dark:text-zinc-300 flex flex-col w-max mx-auto items-center gap-4 {clazz}"
>
  <div class="flex flex-col gap-2 items-center max-w-sm">
    {#if icon}
      <div
        class={[
          iconClass
            ? iconClass
            : 'bg-slate-100 dark:bg-zinc-900 p-3 rounded-2xl text-primary-900 dark:text-primary-100',
        ]}
      >
        <Icon src={icon} size="28" solid />
      </div>
    {/if}
    <div class={['space-y-2', clazz]}>
      <h1
        class="text-slate-900 dark:text-zinc-100 text-xl font-medium text-center"
      >
        {title}
      </h1>
      {#if description}
        <p class="text-center font-normal max-w-80 mx-auto text-balance">
          {description}
        </p>
      {/if}
    </div>
  </div>
  {@render children?.()}
</div>
