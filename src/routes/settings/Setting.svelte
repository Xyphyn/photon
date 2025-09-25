<script lang="ts">
  import { t } from '$lib/app/i18n'
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
    optionClass?: string
    class?: string
    title?: import('svelte').Snippet
    description?: import('svelte').Snippet
    children?: import('svelte').Snippet
    icon?: IconSource
    adaptive?: boolean
  }

  let {
    supportedPlatforms = {
      desktop: true,
      tablet: true,
      mobile: true,
    },
    mainClass = '',
    optionClass = '',
    class: clazz = '',
    title,
    description,
    children,
    icon,
    adaptive = true,
  }: Props = $props()
</script>

<li
  class={[
    'flex flex-col w-full justify-between gap-2 max-w-full @container/setting setting',
    mainClass,
  ]}
>
  {#if Object.values(supportedPlatforms).some((v) => v == false)}
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
  <div class={['setting-grid items-center', adaptive && 'adaptive', clazz]}>
    {#if icon}
      <Icon
        src={icon}
        mini
        size="32"
        class="bg-red-200/20 dark:bg-red-600/20 p-1.5 rounded-lg color
          text-red-500 dark:text-red-300 float-left mr-2 clear-both"
        style="grid-area: icon;"
      />
    {/if}
    <h2
      class="font-medium text-base"
      style="grid-area: title; place-self: end start;"
    >
      {@render title?.()}
    </h2>
    {#if description}
      <div
        class="text-slate-600 dark:text-zinc-400 text-sm"
        style="grid-area: description; place-self: start start;"
      >
        {@render description?.()}
      </div>
    {/if}
    {#if children}
      <div
        class={[
          'w-full flex flex-col gap-2 flex-1 max-w-full shrink-0 row-span-2 max-md:mt-2',
          optionClass,
        ]}
        style="grid-area: children;"
      >
        {@render children?.()}
      </div>
    {/if}
  </div>
</li>

<style>
  .setting-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'icon title'
      'icon description'
      'children children';
  }

  @media screen and (min-width: 768px) {
    .setting-grid.adaptive {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon title children'
        'icon description children';
    }
  }

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
