<script lang="ts">
  import { env } from '$env/dynamic/public'
  import Link from '$comp/input/Link.svelte'
  import Switch from '$comp/input/Switch.svelte'
  import Sort from '$comp/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$comp/lemmy/dropdowns/ViewSelect.svelte'
  import CommonList from '$comp/ui/layout/CommonList.svelte'
  import { locale, t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte'
  import { Button, Option, Select } from 'mono-svelte'
  import {
    ArrowsPointingOut,
    ArrowsRightLeft,
    ArrowsUpDown,
    ArrowTopRightOnSquare,
    ArrowTrendingDown,
    Bars2,
    BarsArrowDown,
    Calendar,
    ChartBar,
    ChatBubbleOvalLeftEllipsis,
    Clock,
    CubeTransparent,
    DocumentText,
    Fire,
    GlobeAmericas,
    Heart,
    Icon,
    Language,
    Photo,
    Star,
    TableCells,
    Tag,
    Trophy,
    ViewColumns,
  } from 'svelte-hero-icons'
  import Setting from '../Setting.svelte'
  import ToggleSetting from '../ToggleSetting.svelte'

  let localeMap: Map<
    string,
    {
      name: string
    }
  > = new Map([
    ['en', { name: 'English' }],
    ['ar', { name: 'العربية' }],
    ['he', { name: 'עברית' }],
    ['bg', { name: 'български' }],
    ['de', { name: 'Deutsch' }],
    ['es', { name: 'Español' }],
    ['et', { name: 'eesti keel' }],
    ['fi', { name: 'suomi' }],
    ['fr', { name: 'Français' }],
    ['hu', { name: 'Magyar' }],
    ['ja', { name: '日本語' }],
    ['nl', { name: 'Nederlands' }],
    ['pl', { name: 'Polski' }],
    ['pt', { name: 'Português (PT)' }],
    ['pt-BR', { name: 'Português (BR)' }],
    ['tr', { name: 'Türkçe' }],
    ['ru', { name: 'Русский' }],
    ['zh-Hans', { name: '简体中文' }],
    ['zh-Hant', { name: '繁體中文' }],
  ])
</script>

<CommonList>
  {#if env.PUBLIC_XYLIGHT_MODE}
    <Setting icon={Heart}>
      {#snippet title()}
        <span class="dark:text-pink-400 text-pink-600">
          {$t('nav.menu.donate')}
        </span>
      {/snippet}
      {#snippet description()}
        {$t('settings.donate.description')}
      {/snippet}
      <Button
        color="none"
        class="bg-gradient-to-r ml-6 dark:from-pink-400 dark:to-fuchsia-400 from-pink-600 to-red-600 text-white dark:text-black"
        href="https://buymeacoffee.com/xylight"
        target="_blank"
        rounding="xl"
        icon={Heart}
      >
        {$t('nav.menu.donate')}
      </Button>
    </Setting>
  {/if}
  <Setting icon={Language}>
    {#snippet title()}
      {$t('settings.app.lang.title')}
    {/snippet}
    {#snippet description()}
      <p>
        {$t('settings.app.lang.description')}
        <Link href="/translators" highlight class="text-base font-semibold">
          {$t('settings.app.lang.credits')}
        </Link>
      </p>
    {/snippet}
    <!--@ts-ignore-->
    <Select bind:value={settings.language}>
      <Option icon={Language} value={null}>
        {$t('settings.app.lang.auto')}
      </Option>
      {#each localeMap.entries() as [key, value]}
        <Option
          data-label={key == 'placeholder'}
          disabled={key == 'placeholder'}
          value={key}
        >
          {value.name}
        </Option>
      {/each}
    </Select>
  </Setting>
  {#if $locale == 'he' || $locale == 'ar'}
    <ToggleSetting
      bind:checked={settings.useRtl}
      title={$t('settings.app.lang.useRtl.title')}
    ></ToggleSetting>
  {/if}
  <Setting icon={ViewColumns}>
    {#snippet title()}
      <span>{$t('settings.app.view.title')}</span>
    {/snippet}
    <ViewSelect showLabel={false} />
    {#snippet description()}
      <p>
        {#if settings.view == 'cozy'}
          {$t('settings.app.view.cozy')}
        {:else if settings.view == 'compact'}
          {$t('settings.app.view.compact')}
        {/if}
      </p>
    {/snippet}
  </Setting>
  <Setting optionClass="flex-2 max-w-full flex-wrap min-w-0 " icon={ChartBar}>
    {#snippet title()}
      <span>{$t('settings.app.sort.title')}</span>
    {/snippet}
    {#snippet description()}
      <span>{$t('settings.app.sort.description')}</span>
    {/snippet}
    <div
      class="flex flex-row flex-wrap
      flex-1 gap-2 w-full lg:w-max max-w-full lg:self-end"
    >
      <Select bind:value={settings.defaultSort.feed}>
        {#snippet customLabel()}
          <div class="flex items-center gap-1">
            <Icon src={GlobeAmericas} size="16" mini />
            {$t('filter.location.label')}
          </div>
        {/snippet}
        <Option value="All">{$t('filter.location.all')}</Option>
        <Option value="Local">{$t('filter.location.local')}</Option>
        <Option value="Subscribed">
          {$t('filter.location.subscribed')}
        </Option>
        <Option value="Moderator">
          {$t('filter.location.moderator')}
        </Option>
      </Select>
      <Sort bind:selected={settings.defaultSort.sort} navigate={false} />
      <Select bind:value={settings.defaultSort.comments}>
        {#snippet customLabel()}
          <div class="flex items-center gap-1">
            <Icon src={ChatBubbleOvalLeftEllipsis} size="14" mini />
            {$t('content.comments')}
          </div>
        {/snippet}

        <Option icon={Fire} value="Hot">{$t('filter.sort.hot')}</Option>
        <Option icon={Trophy} value="Top">
          {$t('filter.sort.top.label')}
        </Option>
        <Option icon={Star} value="New">{$t('filter.sort.new')}</Option>
        <Option icon={Clock} value="Old">{$t('filter.sort.old')}</Option>
        <Option icon={ArrowTrendingDown} value="Controversial">
          {$t('filter.sort.controversial')}
        </Option>
      </Select>
    </div>
  </Setting>
  <ToggleSetting
    icon={BarsArrowDown}
    bind:checked={settings.infiniteScroll}
    title={$t('settings.app.infiniteScroll.title')}
    description={$t('settings.app.infiniteScroll.description')}
  />
  <Setting icon={Photo}>
    {#snippet title()}
      <span>{$t('settings.app.thumbnailSide.title')}</span>
    {/snippet}
    {#snippet description()}
      <span>
        {$t('settings.app.thumbnailSide.description')}
      </span>
    {/snippet}
    <Switch
      options={[true, false]}
      optionNames={[
        $t('settings.app.thumbnailSide.left'),
        $t('settings.app.thumbnailSide.right'),
      ]}
      bind:selected={settings.leftAlign}
    />
  </Setting>
  <ToggleSetting
    icon={ArrowsRightLeft}
    bind:checked={settings.posts.reverseActions}
    title={$t('settings.app.reverseActions.title')}
    description={$t('settings.app.reverseActions.description')}
  />
  <ToggleSetting
    icon={TableCells}
    supportedPlatforms={{ desktop: true, tablet: false, mobile: false }}
    bind:checked={settings.newWidth}
    title={$t('settings.app.limitLayoutWidth.title')}
    description={$t('settings.app.limitLayoutWidth.description')}
  />
  <ToggleSetting
    icon={Calendar}
    bind:checked={settings.absoluteDates}
    title={$t('settings.app.absoluteDates.title')}
    description={$t('settings.app.absoluteDates.description')}
  />
  <ToggleSetting
    icon={ArrowsUpDown}
    bind:checked={settings.voteRatioBar}
    title={$t('settings.app.voteRatioBar.title')}
    description={$t('settings.app.voteRatioBar.description')}
  />
  <ToggleSetting
    icon={CubeTransparent}
    supportedPlatforms={{ desktop: false, tablet: false, mobile: true }}
    bind:checked={settings.dock.autoHide}
    title={$t('settings.navigation.autoHide.title')}
    description={$t('settings.navigation.autoHide.description')}
  />
  <ToggleSetting
    icon={ArrowTopRightOnSquare}
    bind:checked={settings.openLinksInNewTab}
    title={$t('settings.app.postsInNewTab.title')}
    description={$t('settings.app.postsInNewTab.description')}
  />
  <Setting icon={DocumentText}>
    {#snippet title()}
      <span>{$t('settings.app.font.title')}</span>
    {/snippet}
    {#snippet description()}
      <span>{$t('settings.app.font.description')}</span>
    {/snippet}
    <Select bind:value={settings.font}>
      <Option value="inter">Inter</Option>
      <Option value="system">System UI</Option>
      <Option value="browser">Browser</Option>
    </Select>
  </Setting>
  <ToggleSetting
    icon={ArrowsPointingOut}
    bind:checked={settings.expandImages}
    title={$t('settings.app.expandImages.title')}
    description={$t('settings.app.expandImages.description')}
  />
  <ToggleSetting
    icon={Bars2}
    bind:checked={settings.posts.deduplicateEmbed}
    title={$t('settings.app.duplicateTitles.title')}
    description={$t('settings.app.duplicateTitles.description')}
  />
  <ToggleSetting
    icon={ArrowTopRightOnSquare}
    bind:checked={settings.posts.titleOpensUrl}
    title={$t('settings.app.titleOpensUrl.title')}
    description={$t('settings.app.titleOpensUrl.description')}
  />
  <ToggleSetting
    icon={Tag}
    title={$t('settings.app.titleTags.title')}
    description={$t('settings.app.titleTags.description')}
    bind:checked={settings.parseTags}
  />
</CommonList>
