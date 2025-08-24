<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.svelte.js'
  import { Select, TextInput } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import { CursorArrowRays, VideoCamera } from 'svelte-hero-icons'
  import Setting from '../Setting.svelte'
  import ToggleSetting from '../ToggleSetting.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
</script>

<CommonList>
  <ToggleSetting
    icon={CursorArrowRays}
    title={$t('settings.embeds.clickToView.title')}
    description={$t('settings.embeds.clickToView.description')}
    bind:checked={settings.embeds.clickToView}
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
    <Select bind:value={settings.embeds.youtube}>
      <Option value="youtube">YouTube</Option>
      <Option value="invidious">Invidious</Option>
      <Option value="piped">Piped</Option>
    </Select>
  </Setting>
  {#if settings.embeds.youtube == 'invidious'}
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
        bind:value={settings.embeds.invidious}
      />
    </Setting>
  {/if}
  {#if settings.embeds.youtube == 'piped'}
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
        bind:value={settings.embeds.piped}
      />
    </Setting>
  {/if}
</CommonList>
