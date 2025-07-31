<script lang="ts">
  import { env } from '$env/dynamic/public'
  import { profile } from '$lib/auth.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { removalTemplate } from '$lib/components/lemmy/moderation/moderation.js'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { locale, locales, t } from '$lib/i18n/translations'
  import { defaultSettings, settings } from '$lib/settings.svelte'
  import { DOMAIN_REGEX_FORMS } from '$lib/util.svelte.js'
  import {
    Button,
    Checkbox,
    Material,
    Modal,
    Select,
    Switch,
    TextArea,
    TextInput,
    toast,
  } from 'mono-svelte'
  import Option from 'mono-svelte/forms/select/Option.svelte'
  import {
    ArrowDownTray,
    ArrowPath,
    ArrowRight,
    ArrowsPointingOut,
    ArrowsRightLeft,
    ArrowTopRightOnSquare,
    ArrowTrendingDown,
    ArrowUpTray,
    Bars2,
    Bars3,
    BarsArrowDown,
    Beaker,
    BookOpen,
    BugAnt,
    Calendar,
    ChartBar,
    ChatBubbleOvalLeftEllipsis,
    ChevronDown,
    Clock,
    CubeTransparent,
    CursorArrowRays,
    DocumentText,
    ExclamationTriangle,
    Eye,
    EyeSlash,
    Fire,
    GlobeAmericas,
    Heart,
    Icon,
    Language,
    Photo,
    Plus,
    ServerStack,
    Share,
    Star,
    TableCells,
    Tag,
    Trash,
    Trophy,
    User,
    VideoCamera,
    ViewColumns,
  } from 'svelte-hero-icons'
  import Section from './Section.svelte'
  import Setting from './Setting.svelte'
  import ToggleSetting from './ToggleSetting.svelte'
  import { page } from '$app/state'
  import Markdown from '$lib/components/markdown/Markdown.svelte'

  let importing = $state(false)
  let importText = $state('')

  let diagnostic = $state({
    open: false,
    profile: false,
    settings: false,
    device: false,
  })

  let diagPayload = $derived(calculatePayload(diagnostic))

  function calculatePayload(args: {
    profile: boolean
    settings: boolean
    device: boolean
  }) {
    // eslint-disable-next-line
    let payload: Record<string, any> = {}

    if (args.profile) {
      payload.profiles = {
        count: profile.meta.profiles.length,
        instances: [profile.meta.profiles.map(i => i.instance)],
      }
    }
    if (args.settings) {
      payload.settings = $state.snapshot(settings)
    }
    if (args.device) {
      payload.device = {
        userAgent: navigator.userAgent,
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
          ratio: window.devicePixelRatio,
        },
        language: navigator.language,
        platform: navigator.platform,
      }
    }

    return payload
  }

  let localeMap: Map<
    string,
    {
      name: string
      translated: number
      flag: string
    }
  > = new Map([
    ['en', { name: 'English', translated: -1, flag: '🇬🇧' }],
    ['ar', { name: 'العربية', translated: 0.3, flag: '🟩' }],
    ['he', { name: 'עברית', translated: -1, flag: '🇮🇱' }],
    ['bg', { name: 'български', translated: 0.67, flag: '🇧🇬' }],
    ['de', { name: 'Deutsch', translated: 0.7, flag: '🇩🇪' }],
    ['es', { name: 'Español', translated: 0.89, flag: '🇪🇸' }],
    ['et', { name: 'eesti keel', translated: 0.23, flag: '🇪🇪' }],
    ['fi', { name: 'suomi', translated: 0.98, flag: '🇫🇮' }],
    ['fr', { name: 'Français', translated: 0.93, flag: '🇫🇷' }],
    ['hu', { name: 'Magyar', translated: 0.51, flag: '🇭🇺' }],
    ['ja', { name: '日本語', translated: 0.93, flag: '🇯🇵' }],
    ['nl', { name: 'Nederlands', translated: 0.89, flag: '🇳🇱' }],
    ['pl', { name: 'Polski', translated: 0.91, flag: '🇵🇱' }],
    ['pt', { name: 'Português (PT)', translated: 0.86, flag: '🇵🇹' }],
    ['pt-BR', { name: 'Português (BR)', translated: 0.86, flag: '🇧🇷' }],
    ['tr', { name: 'Türkçe', translated: 0.99, flag: '🇹🇷' }],
    ['ru', { name: 'Русский', translated: 0.88, flag: '🇷🇺' }],
    ['zh-Hans', { name: '简体中文', translated: 0.83, flag: '🇨🇳' }],
    ['zh-Hant', { name: '繁體中文', translated: 0.23, flag: '🇹🇼' }],
  ])
</script>

<svelte:head>
  <title>{$t('settings.title')}</title>
</svelte:head>

{#if importing}
  <Modal
    bind:open={importing}
    onaction={() => {
      try {
        if (importText == '') {
          throw new Error('Import is empty')
        }
        const parsed = JSON.parse(importText)
        const merged = { ...defaultSettings, ...parsed }

        Object.assign(settings, merged)

        toast({ content: $t('toast.settingsImport'), type: 'success' })
        importing = false
      } catch (err) {
        toast({ content: err as string, type: 'error' })
      }
    }}
    title={$t('routes.theme.import')}
    action={$t('routes.theme.import')}
  >
    <TextArea bind:value={importText} style="font-family: monospace;" />
  </Modal>
{/if}

{#if diagnostic.open}
  <Modal title={$t('settings.usageInfo.title')} bind:open={diagnostic.open}>
    <Markdown
      source={$t('settings.usageInfo.body', { hostname: page.url.hostname })}
    />
    <hr class="my-1 border-slate-200 dark:border-zinc-800" />
    <Switch bind:checked={diagnostic.profile}>
      {$t('settings.usageInfo.profiles')}
    </Switch>
    <Switch bind:checked={diagnostic.settings}>
      {$t('settings.usageInfo.settings')}
    </Switch>
    <Switch bind:checked={diagnostic.device}>
      {$t('settings.usageInfo.device')}
    </Switch>
    <pre class="max-w-full">
      {JSON.stringify(diagPayload, undefined, 2)}
    </pre>
  </Modal>
{/if}

<Header pageHeader class="text-3xl font-bold flex justify-between">
  {$t('settings.title')}
  {#snippet extended()}
    <div class="flex items-center tracking-normal gap-2">
      <Button
        onclick={() => {
          importText = ''
          importing = true
        }}
        rounding="pill"
      >
        {#snippet prefix()}
          <Icon src={ArrowDownTray} mini size="18" />
        {/snippet}
        {$t('settings.import')}
      </Button>
      <Button
        onclick={() => {
          const json = JSON.stringify(settings)
          navigator?.clipboard?.writeText?.(json)
          toast({ content: $t('toast.copied') })
        }}
        rounding="pill"
      >
        {#snippet prefix()}
          <Icon src={ArrowUpTray} mini size="18" />
        {/snippet}
        {$t('settings.export')}
      </Button>
      <Button
        onclick={() => {
          toast({
            content: $t('toast.resetSettings'),
            action: () => {
              Object.assign(settings, defaultSettings)
            },
          })
        }}
        rounding="pill"
      >
        {#snippet prefix()}
          <Icon src={ArrowPath} mini size="18" />
        {/snippet}
        {$t('settings.reset')}
      </Button>
    </div>
  {/snippet}
</Header>

<div class="flex items-center gap-2 flex-wrap w-full my-5">
  <Button href="#app" size="sm" class="text-xs" rounding="pill">
    <Icon src={ArrowTopRightOnSquare} size="14" micro />
    {$t('settings.app.title')}
  </Button>
  <Button href="#embeds" size="sm" class="text-xs" rounding="pill">
    <Icon src={ArrowTopRightOnSquare} size="14" micro />
    {$t('settings.embeds.title')}
  </Button>
  <Button href="#lemmy" size="sm" class="text-xs" rounding="pill">
    <Icon src={ArrowTopRightOnSquare} size="14" micro />
    {$t('settings.lemmy.title')}
  </Button>
  <Button href="#moderation" size="sm" class="text-xs" rounding="pill">
    <Icon src={ArrowTopRightOnSquare} size="14" micro />
    {$t('settings.moderation.title')}
  </Button>
  <Button href="#other" size="sm" class="text-xs" rounding="pill">
    <Icon src={ArrowTopRightOnSquare} size="14" micro />
    {$t('settings.other.title')}
  </Button>
</div>

{#if env.PUBLIC_DIAGNOSTICS.toLowerCase() == 'true'}
  <Button
    onclick={() => (diagnostic.open = !diagnostic.open)}
    rounding="pill"
    class="w-max"
  >
    {#snippet prefix()}
      <Icon src={Beaker} mini size="18" />
    {/snippet}
    {$t('settings.usageInfo.title')}
  </Button>
{/if}

<div
  class="flex flex-col *:py-2 divide-y divide-slate-200 dark:divide-zinc-800"
  style="scroll-behavior: smooth;"
>
  {#if profile.current?.jwt}
    <Section open={false} id="account" title={$t('settings.account.title')}>
      <div>
        <Button
          color="primary"
          size="lg"
          href="/profile/settings"
          class="block"
        >
          {$t('profile.profile')}
          {#snippet suffix()}
            <Icon src={ArrowRight} micro size="16" />
          {/snippet}
        </Button>
      </div>
    </Section>
  {/if}
  <Section id="app" title={$t('settings.app.title')}>
    {#if env.PUBLIC_XYLIGHT_MODE}
      <Setting icon={Heart}>
        {#snippet title()}
          <span class="dark:text-pink-400 text-pink-600 font-medium">
            {$t('nav.menu.donate')}
          </span>
        {/snippet}
        {#snippet description()}
          <p class="max-w-xl">
            {$t('settings.donate.description')}
          </p>
        {/snippet}
        <Button
          color="none"
          class="dark:bg-pink-400 bg-pink-600 text-white dark:text-black"
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
    <li class="flex flex-col gap-2">
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
              {mapped?.flag}
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
    </li>
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
      <MultiSelect
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
  </Section>

  <Section id="embeds" title={$t('settings.embeds.title')}>
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
  </Section>

  <Section id="lemmy" title={$t('settings.lemmy.title')}>
    <ToggleSetting
      icon={Eye}
      bind:checked={settings.posts.showHidden}
      title={$t('settings.lemmy.showHiddenPosts.title')}
      description={$t('settings.lemmy.showHiddenPosts.description')}
    />
    <ToggleSetting
      icon={Bars3}
      bind:checked={settings.posts.compactFeatured}
      title={$t('settings.lemmy.compactFeatured.title')}
      description={$t('settings.lemmy.compactFeatured.description')}
    />
    <ToggleSetting
      icon={BookOpen}
      bind:checked={settings.markPostsAsRead}
      title={$t('settings.lemmy.markReadPosts.title')}
      description={$t('settings.lemmy.markReadPosts.description')}
    />
    <ToggleSetting
      icon={CubeTransparent}
      bind:checked={settings.markReadPosts}
      title={$t('settings.lemmy.fadeReadPosts.title')}
      description={$t('settings.lemmy.fadeReadPosts.description')}
    />
    <ToggleSetting
      icon={Share}
      bind:checked={settings.crosspostOriginalLink}
      title={$t('settings.lemmy.crosspostMarker.title')}
      description={$t('settings.lemmy.crosspostMarker.description')}
    />
    <Setting icon={EyeSlash}>
      {#snippet title()}
        <span>{$t('settings.lemmy.hideSubmissions.title')}</span>
      {/snippet}
      {#snippet description()}
        <span>
          <p>{$t('settings.lemmy.hideSubmissions.description')}</p>
        </span>
      {/snippet}
      <div class="flex flex-col items-start gap-4 flex-wrap">
        <Switch bind:checked={settings.hidePosts.deleted}>
          {$t('settings.lemmy.hideSubmissions.deleted')}
        </Switch>
        <Switch bind:checked={settings.hidePosts.removed}>
          {$t('settings.lemmy.hideSubmissions.removed')}
        </Switch>
      </div>
    </Setting>
    <ToggleSetting
      icon={ExclamationTriangle}
      bind:checked={settings.nsfwBlur}
      title={$t('settings.lemmy.nsfwBlur.title')}
      description={$t('settings.lemmy.nsfwBlur.description')}
    />
    <Setting icon={ServerStack}>
      {#snippet title()}
        <span>{$t('settings.lemmy.instances.title')}</span>
      {/snippet}
      {#snippet description()}
        <span>
          {$t('settings.lemmy.instances.description')}
        </span>
      {/snippet}
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Checkbox bind:checked={settings.showInstances.user}>
          {$t('content.users')}
        </Checkbox>
        <Checkbox bind:checked={settings.showInstances.comments}>
          {$t('content.comments')}
        </Checkbox>
        <Checkbox bind:checked={settings.showInstances.community}>
          {$t('content.communities')}
        </Checkbox>
      </div>
    </Setting>
    <ToggleSetting
      icon={User}
      bind:checked={settings.displayNames}
      title={$t('settings.app.displayName.title')}
      description={$t('settings.app.displayName.description')}
    />
  </Section>

  <Section id="moderation" title={$t('settings.moderation.title')}>
    <Setting icon={Trash}>
      {#snippet title()}
        <span>{$t('settings.moderation.replyPresets.title')}</span>
      {/snippet}
      {#snippet description()}
        <span>
          <p>{$t('settings.moderation.replyPresets.description')}</p>
          <ul class="leading-6">
            <li>{$t('settings.moderation.replyPresets.syntax')}</li>
            <li>
              <code>{'{{reason}}'}</code>
            </li>
            <li>
              <code>{'{{post}}'}</code>
            </li>
            <li>
              <code>{'{{community}}'}</code>
            </li>
            <li>
              <code>{'{{username}}'}</code>
            </li>
          </ul>
        </span>
      {/snippet}
      {#each settings.moderation.presets as preset, index (preset)}
        <Material
          color="transparent"
          rounding="xl"
          padding="sm"
          class="py-3 w-full rounded-full"
        >
          <details>
            <summary
              class="cursor-pointer inline-flex flex-row items-center w-full gap-1"
            >
              <Icon src={ChevronDown} mini size="16" />
              {preset.title}
              <Button
                size="square-md"
                rounding="lg"
                class="ml-auto"
                onclick={() => {
                  settings.moderation.presets.splice(index, 1)
                  settings.moderation.presets = settings.moderation.presets
                }}
              >
                <Icon src={Trash} size="16" mini />
              </Button>
            </summary>
            <div class="flex flex-col gap-3 mt-2">
              <TextInput
                label="Title"
                bind:value={preset.title}
                placeholder="Reason 1"
              />
              <MarkdownEditor
                bind:value={preset.content}
                label="Content"
                images={false}
                previewButton
                beforePreview={input =>
                  removalTemplate(input, {
                    postTitle: '<Example post>',
                    communityLink: '[!community@example.com]()',
                    reason: '<Being a meanie>',
                    username: '@Bob',
                  })}
              />
            </div>
          </details>
        </Material>
      {/each}
      <Material color="transparent" rounding="xl" padding="none" class="w-full">
        <Button
          color="none"
          class="w-full"
          onclick={() => {
            settings.moderation.presets = [
              ...settings.moderation.presets,
              {
                title: `Preset ${settings.moderation.presets.length + 1}`,
                content:
                  'Your submission in *{{post}}* was removed for *{{reason}}*.',
              },
            ]
          }}
        >
          {#snippet prefix()}
            <Icon src={Plus} mini size="16" />
          {/snippet}
          Add Preset
        </Button>
      </Material>
    </Setting>
  </Section>

  <Section id="other" title={$t('settings.other.title')}>
    <ToggleSetting
      icon={BugAnt}
      bind:checked={settings.debugInfo}
      title={$t('settings.other.debug.title')}
      description={$t('settings.other.debug.description')}
    />
    <ToggleSetting
      icon={Bars3}
      bind:checked={settings.posts.noVirtualize}
      title={$t('settings.other.virtualizeFeeds.title')}
      description={$t('settings.other.virtualizeFeeds.description')}
    />
  </Section>
</div>

<style>
  [data-hide-selected]::before {
    content: attr(data-label);
    font-size: small;
  }
</style>
