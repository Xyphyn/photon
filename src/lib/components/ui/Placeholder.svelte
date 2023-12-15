<script lang="ts">
  import { Icon, type IconSource } from 'svelte-hero-icons'

  export let icon: IconSource | undefined = undefined

  export let title: string
  export let description: string | undefined = undefined
  export let center: boolean = true
</script>

<div
  class="text-slate-700 dark:text-zinc-300 flex flex-col {center
    ? 'justify-center items-center'
    : 'justify-start items-start'} gap-2 {$$props.class}"
>
  {#if icon}
    <div
      class="border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 p-3 rounded-full"
    >
      <Icon src={icon} size="28" />
    </div>
  {/if}
  <div
    class="flex flex-col gap-1 {center
      ? 'text-center'
      : 'text-left'} {$$props.class}"
  >
    <h1 class="text-slate-900 dark:text-zinc-100 text-lg font-medium">
      {title}
    </h1>
    {#if description}
      <p class="text-sm {center ? 'text-center' : 'text-left'} font-normal">
        {description}
      </p>
    {/if}
  </div>
  <slot />
</div>
