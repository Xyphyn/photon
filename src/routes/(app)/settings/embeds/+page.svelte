<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/app/util.svelte'
  import { CommonList } from '$lib/ui/layout'
  import { Option, Select, TextInput } from 'mono-svelte'
  import { CursorArrowRays, VideoCamera } from 'svelte-hero-icons/dist'
  import Setting from '../Setting.svelte'
  import ToggleSetting from '../ToggleSetting.svelte'
</script>

<CommonList>
  <ToggleSetting
    icon={CursorArrowRays}
    title={$t('settings.embeds.clickToView.title')}
    description={$t('settings.embeds.clickToView.description')}
    bind:checked={settings.value.embeds.clickToView}
  />
  <Setting icon={VideoCamera}>
    {#snippet title()}
      <span>YouTube</span>
    {/snippet}
    {#snippet description()}
      <span>
        {$t('settings.embeds.youtube.description')}
      </span>
    {/snippet}
    <Select bind:value={settings.value.embeds.youtube}>
      <Option value="youtube">YouTube</Option>
      <Option value="invidious">Invidious</Option>
      <Option value="piped">Piped</Option>
    </Select>
  </Setting>
  {#if settings.value.embeds.youtube == 'invidious'}
    <Setting>
      {#snippet title()}
        <span>{$t('settings.embeds.instance.invidious')}</span>
      {/snippet}
      {#snippet description()}
        <span>
          {$t('settings.embeds.instance.description')}
        </span>
      {/snippet}
      <TextInput
        label={$t('settings.embeds.instance.invidious')}
        pattern={DOMAIN_REGEX_FORMS}
        bind:value={settings.value.embeds.invidious}
      />
    </Setting>
  {/if}
  {#if settings.value.embeds.youtube == 'piped'}
    <Setting>
      {#snippet title()}
        <span>{$t('settings.embeds.instance.piped')}</span>
      {/snippet}
      {#snippet description()}
        <span>
          {$t('settings.embeds.instance.description')}
        </span>
      {/snippet}
      <TextInput
        label={$t('settings.embeds.instance.piped')}
        pattern={DOMAIN_REGEX_FORMS}
        bind:value={settings.value.embeds.piped}
      />
    </Setting>
  {/if}
</CommonList>
