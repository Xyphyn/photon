<script lang="ts">
  import { Icon, type IconSource } from 'svelte-hero-icons'

  export let icon: IconSource | undefined = undefined

  export let title: string
  export let description: string | undefined = undefined
  export let center: boolean = false
</script>

<div
  class="text-slate-700 dark:text-zinc-300 flex flex-col w-max mx-auto items-center gap-4 {$$props.class}"
>
  <div class="flex flex-row gap-4 items-center max-w-sm">
    {#if icon}
      <div
        class="border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 p-3 rounded-full"
      >
        <Icon src={icon} size="28" />
      </div>
    {/if}
    <div class={$$props.class}>
      <h1 class="text-slate-900 dark:text-zinc-100 text-lg font-medium">
        {title}
      </h1>
      {#if description}
        <p class="text-sm {center ? 'text-center' : 'text-left'} font-normal">
          {description}
        </p>
      {/if}
    </div>
  </div>
  <slot />
</div>
