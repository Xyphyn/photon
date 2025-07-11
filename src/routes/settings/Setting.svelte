<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { Badge } from 'mono-svelte'
  import {
    ComputerDesktop,
    DevicePhoneMobile,
    DeviceTablet,
    Icon,
    type IconSource,
  } from 'svelte-hero-icons'

  interface Props {
    supportedPlatforms?: {
      desktop: boolean
      tablet: boolean
      mobile: boolean
    }
    mainClass?: string
    itemsClass?: string
    optionClass?: string
    class?: string
    title?: import('svelte').Snippet
    description?: import('svelte').Snippet
    children?: import('svelte').Snippet
    icon?: IconSource
  }

  let {
    supportedPlatforms = {
      desktop: true,
      tablet: true,
      mobile: true,
    },
    mainClass = '',
    itemsClass = '',
    optionClass = '',
    class: clazz = '',
    title,
    description,
    children,
    icon,
  }: Props = $props()
</script>

<div
  class={[
    'flex flex-col w-full justify-between gap-2 max-w-full @container/setting setting',
    mainClass,
  ]}
>
  {#if Object.values(supportedPlatforms).some(v => v == false)}
    <div class="flex items-center gap-2 flex-wrap">
      {#if supportedPlatforms.desktop}
        <Badge>
          {#snippet icon()}
            <Icon src={ComputerDesktop} micro size="14" />
          {/snippet}
          {$t('settings.desktop')}
        </Badge>
      {/if}
      {#if supportedPlatforms.tablet}
        <Badge>
          {#snippet icon()}
            <Icon src={DeviceTablet} micro size="14" />
          {/snippet}
          {$t('settings.tablet')}
        </Badge>
      {/if}
      {#if supportedPlatforms.mobile}
        <Badge>
          {#snippet icon()}
            <Icon src={DevicePhoneMobile} micro size="14" />
          {/snippet}
          {$t('settings.mobile')}
        </Badge>
      {/if}
    </div>
  {/if}
  <div
    class="flex flex-col @md/setting:flex-row items-center gap-2 {itemsClass}"
  >
    {#if icon}
      <Icon
        src={icon}
        size="32"
        class="bg-red-200/20 dark:bg-red-800/20 p-1.5 self-start @md/setting:self-center rounded-lg color text-red-500 dark:text-red-200"
      />
    {/if}
    <div class="flex flex-col gap-0.5 flex-2 w-full shrink-0 min-w-48 {clazz}">
      <h1 class="font-medium text-base">
        {@render title?.()}
      </h1>
      {#if description}
        <div class="text-slate-600 dark:text-zinc-400 text-sm">
          {@render description?.()}
        </div>
      {/if}
    </div>
    {#if children}
      <div
        class="w-full flex flex-col gap-2 flex-1 max-w-full
         @md/setting:items-end shrink-0 {optionClass}"
      >
        {@render children?.()}
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.setting:nth-child(17n + 1) .color) {
    filter: hue-rotate(10deg);
  }
  :global(.setting:nth-child(17n + 2) .color) {
    filter: hue-rotate(30deg);
  }
  :global(.setting:nth-child(17n + 3) .color) {
    filter: hue-rotate(50deg);
  }
  :global(.setting:nth-child(17n + 4) .color) {
    filter: hue-rotate(70deg);
  }
  :global(.setting:nth-child(17n + 5) .color) {
    filter: hue-rotate(90deg);
  }
  :global(.setting:nth-child(17n + 6) .color) {
    filter: hue-rotate(110deg);
  }
  :global(.setting:nth-child(17n + 7) .color) {
    filter: hue-rotate(130deg);
  }
  :global(.setting:nth-child(17n + 8) .color) {
    filter: hue-rotate(150deg);
  }
  :global(.setting:nth-child(17n + 9) .color) {
    filter: hue-rotate(170deg);
  }
  :global(.setting:nth-child(17n + 10) .color) {
    filter: hue-rotate(190deg);
  }
  :global(.setting:nth-child(17n + 11) .color) {
    filter: hue-rotate(210deg);
  }
  :global(.setting:nth-child(17n + 12) .color) {
    filter: hue-rotate(230deg);
  }
  :global(.setting:nth-child(17n + 13) .color) {
    filter: hue-rotate(250deg);
  }
  :global(.setting:nth-child(17n + 14) .color) {
    filter: hue-rotate(270deg);
  }
  :global(.setting:nth-child(17n + 15) .color) {
    filter: hue-rotate(290deg);
  }
  :global(.setting:nth-child(17n + 16) .color) {
    filter: hue-rotate(310deg);
  }
  :global(.setting:nth-child(17n + 17) .color) {
    filter: hue-rotate(330deg);
  }
</style>
