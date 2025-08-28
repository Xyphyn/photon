<script lang="ts">
  import { env } from '$env/dynamic/public'
  import { locale, locales, t } from '$lib/i18n/translations'
  import { Button, Option, Select } from 'mono-svelte'
  import ToggleSetting from '../ToggleSetting.svelte'
  import {
    ArrowPath,
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
  import Link from '$lib/components/input/Link.svelte'
  import { settings } from '$lib/settings.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import Switch from '$lib/components/input/Switch.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'

  let localeMap: Map<
    string,
    {
      name: string
      translated: number
    }
  > = new Map([
    ['en', { name: 'English', translated: -1 }],
    ['ar', { name: 'العربية', translated: 0.3 }],
    ['he', { name: 'עברית', translated: -1 }],
    ['bg', { name: 'български', translated: 0.67 }],
    ['de', { name: 'Deutsch', translated: 0.7 }],
    ['es', { name: 'Español', translated: 0.89 }],
    ['et', { name: 'eesti keel', translated: 0.23 }],
    ['fi', { name: 'suomi', translated: 0.98 }],
    ['fr', { name: 'Français', translated: 0.93 }],
    ['hu', { name: 'Magyar', translated: 0.51 }],
    ['ja', { name: '日本語', translated: 0.93 }],
    ['nl', { name: 'Nederlands', translated: 0.89 }],
    ['pl', { name: 'Polski', translated: 0.91 }],
    ['pt', { name: 'Português (PT)', translated: 0.86 }],
    ['pt-BR', { name: 'Português (BR)', translated: 0.86 }],
    ['tr', { name: 'Türkçe', translated: 0.99 }],
    ['ru', { name: 'Русский', translated: 0.88 }],
    ['zh-Hans', { name: '简体中文', translated: 0.83 }],
    ['zh-Hant', { name: '繁體中文', translated: 0.23 }],
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
      >
        {#snippet prefix()}
          <Icon src={Heart} size="16" micro />
        {/snippet}
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
      {#each $locales as locale (locale)}
        {@const mapped = localeMap.get(locale) ?? {
          flag: '',
          translated: 1,
          name: locale,
        }}
        <Option value={locale}>
          {mapped?.name}
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
      <div class="max-w-full">
        <Select bind:value={settings.defaultSort.feed}>
          {#snippet customLabel()}
            <span class="flex items-center gap-1">
              <Icon src={GlobeAmericas} size="16" mini />
              {$t('filter.location.label')}
            </span>
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
      </div>
      <div class="max-w-full">
        <Sort bind:selected={settings.defaultSort.sort} navigate={false} />
      </div>
      <div class="max-w-full">
        <Select bind:value={settings.defaultSort.comments}>
          {#snippet customLabel()}
            <span class="flex items-center gap-1">
              <Icon src={ChatBubbleOvalLeftEllipsis} size="14" mini />
              {$t('content.comments')}
            </span>
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
    icon={ArrowPath}
    bind:checked={settings.randomPlaceholders}
    title={$t('settings.app.placeholders.title')}
    description={$t('settings.app.placeholders.description')}
  />
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
