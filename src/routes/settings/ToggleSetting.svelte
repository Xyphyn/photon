<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { Badge, Switch } from 'mono-svelte'
  import {
    ComputerDesktop,
    DevicePhoneMobile,
    DeviceTablet,
    Icon,
    type IconSource,
  } from 'svelte-hero-icons'

  interface Props {
    title: string
    description?: string | undefined
    checked?: boolean
    beta?: boolean
    supportedPlatforms?: {
      desktop: boolean
      tablet: boolean
      mobile: boolean
    }
    icon?: IconSource
  }

  let {
    title,
    description = undefined,
    checked = $bindable(false),
    beta = false,
    supportedPlatforms = {
      desktop: true,
      tablet: true,
      mobile: true,
    },
    icon,
  }: Props = $props()
</script>

<li
  class="flex flex-col w-full justify-between gap-2 max-w-full setting @container/setting"
>
  {#if Object.values(supportedPlatforms).some(v => v == false) || beta}
    <div class="flex items-center gap-2 flex-wrap">
      {#if beta}
        <Badge>Beta</Badge>
      {/if}
      {#if Object.values(supportedPlatforms).some(v => v == false)}
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
      {/if}
    </div>
  {/if}
  <div class="flex @md/setting:flex-row gap-2">
    {#if icon}
      <Icon
        src={icon}
        size="32"
        class="bg-red-200/20 dark:bg-red-600/20 p-1.5 self-center
         rounded-lg color text-red-500 dark:text-red-300"
      />
    {/if}
    <Switch
      bind:checked
      class="flex-row-reverse items-center w-full"
      labelClass="flex-1 mr-auto"
    >
      <h1 class="font-medium text-base">{title}</h1>
      {#if description}
        <p class="text-slate-600 dark:text-zinc-400 text-sm">
          {description}
        </p>
      {/if}
    </Switch>
  </div>
</li>
