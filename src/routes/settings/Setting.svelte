<script lang="ts">
  import { t } from '$lib/translations'
  import { Badge } from 'mono-svelte'
  import {
    ComputerDesktop,
    DevicePhoneMobile,
    DeviceTablet,
    Icon,
  } from 'svelte-hero-icons'

  export let vertical: boolean = false

  export let supportedPlatforms = {
    desktop: true,
    tablet: true,
    mobile: true,
  }
</script>

<div
  class="flex flex-col w-full justify-between gap-2 max-w-full {$$props.mainClass}"
>
  {#if Object.values(supportedPlatforms).some((v) => v == false)}
    <div class="flex items-center gap-2 flex-wrap">
      {#if supportedPlatforms.desktop}
        <Badge>
          <Icon src={ComputerDesktop} micro size="14" slot="icon" />
          {$t('settings.desktop')}
        </Badge>
      {/if}
      {#if supportedPlatforms.tablet}
        <Badge>
          <Icon src={DeviceTablet} micro size="14" slot="icon" />
          {$t('settings.tablet')}
        </Badge>
      {/if}
      {#if supportedPlatforms.mobile}
        <Badge>
          <Icon src={DevicePhoneMobile} micro size="14" slot="icon" />
          {$t('settings.mobile')}
        </Badge>
      {/if}
    </div>
  {/if}
  <div class="flex flex-row items-center gap-6 {$$props.itemsClass}">
    <div class="flex flex-col gap-0.5 flex-1 {$$props.class}">
      <h1 class="font-medium text-base"><slot name="title" /></h1>
      {#if $$slots.description}
        <p class="text-slate-800 dark:text-zinc-200 text-sm">
          <slot name="description" />
        </p>
      {/if}
    </div>
    {#if $$slots.default}
      <div
        class="w-full flex flex-col gap-2 flex-1 items-end max-w-full {$$props.optionClass}"
      >
        <slot />
      </div>
    {/if}
  </div>
</div>
