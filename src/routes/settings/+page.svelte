<script lang="ts">
  import { defaultSettings, userSettings } from '$lib/settings'
  import Setting from './Setting.svelte'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Sort from '$lib/components/lemmy/dropdowns/Sort.svelte'
  import {
    Badge,
    Disclosure,
    Material,
    Note,
    Switch,
    TextInput,
    toast,
    Popover,
  } from 'mono-svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import Link from '$lib/components/input/Link.svelte'
  import {
    ArrowPath,
    ArrowRight,
    ChatBubbleOvalLeftEllipsis,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    GlobeAmericas,
    Icon,
    Plus,
    Trash,
  } from 'svelte-hero-icons'
  import MarkdownEditor from '$lib/components/markdown/MarkdownEditor.svelte'
  import { removalTemplate } from '$lib/components/lemmy/moderation/moderation.js'
  import { Button, Checkbox, Select } from 'mono-svelte'
  import ViewSelect from '$lib/components/lemmy/dropdowns/ViewSelect.svelte'
  import { LINKED_INSTANCE_URL } from '$lib/instance.js'
  import { DOMAIN_REGEX_FORMS, removeItem } from '$lib/util.js'
  import Section from './Section.svelte'
  import ToggleSetting from './ToggleSetting.svelte'
  import { locale, locales, t } from '$lib/translations'
  import { defaultLinks, iconOfLink } from '$lib/components/ui/navbar/link'

  let pin: string = ''
</script>

<svelte:head>
  <title>{$t('settings.title')}</title>
</svelte:head>

<h1 class="text-3xl font-bold flex justify-between">
  {$t('settings.title')}
  <Button
    size="square-md"
    on:click={() => {
      toast({
        content: $t('toast.resetSettings'),
        action: () => ($userSettings = defaultSettings),
      })
    }}
    class="font-normal"
  >
    <Icon src={ArrowPath} mini size="16" slot="prefix" />
  </Button>
</h1>

<div class="flex flex-col gap-4" style="scroll-behavior: smooth;">
  <Section title={$t('settings.navigation.title')}>
    <Setting>
      <span slot="title">{$t('settings.navigation.dockPos.title')}</span>
      <span slot="description">
        {$t('settings.navigation.dockPos.description')}
      </span>
      <MultiSelect
        options={[true, false, null]}
        optionNames={[
          $t('settings.navigation.dockPos.top'),
          $t('settings.navigation.dockPos.bottom'),
          $t('settings.navigation.dockPos.adaptive'),
        ]}
        bind:selected={$userSettings.dock.top}
      />
    </Setting>
    <Setting>
      <span slot="title">{$t('settings.navigation.panel.title')}</span>
      <span slot="description">
        {$t('settings.navigation.panel.description')}
      </span>
      <MultiSelect
        options={[true, false, null]}
        optionNames={[
          $t('settings.navigation.panel.on'),
          $t('settings.navigation.panel.off'),
          $t('settings.navigation.panel.adaptive'),
        ]}
        bind:selected={$userSettings.dock.noGap}
      />
    </Setting>
    <Setting
      supportedPlatforms={{ desktop: true, tablet: true, mobile: false }}
    >
      <span slot="title">{$t('settings.navigation.pins.title')}</span>
      <span slot="description">
        {$t('settings.navigation.pins.description')}
      </span>
      <div class="flex items-center gap-1 flex-wrap">
        {#each defaultLinks as pin}
          <Popover openOnHover placement="bottom">
            <Button
              size="square-md"
              slot="target"
              disabled={$userSettings.dock.pins
                ?.map((p) => p.url)
                ?.includes(pin.url)}
              on:click={() => {
                $userSettings.dock.pins = [
                  ...($userSettings.dock.pins ?? []),
                  pin,
                ]
              }}
            >
              <Icon src={iconOfLink(pin.url)} mini size="16" />
            </Button>
            <Material
              slot="popover"
              padding="none"
              class="px-4 py-2 flex flex-col"
            >
              <span class="font-medium text-lg">{pin.label}</span>
              <code class="bg-slate-50 dark:!bg-zinc-950 !rounded-md">
                {pin.url}
              </code>
            </Material>
          </Popover>
        {/each}
      </div>
    </Setting>
  </Section>

  <Section title={$t('settings.app.title')}>
    <div class="flex flex-col gap-2">
      <Setting>
        <span slot="title" class="inline-flex items-center gap-2">
          {$t('settings.app.lang.title')}
          <Badge>{$t('settings.beta')}</Badge>
        </span>
        <p slot="description">
          {$t('settings.app.lang.description')}
          <Note>
            {$t('settings.app.lang.note')}
          </Note>
          <Link href="/translators" highlight class="text-base font-semibold">
            {$t('settings.app.lang.credits')}
          </Link>
        </p>
        <Select bind:value={$userSettings.language}>
          <option value={null}>{$t('settings.app.lang.auto')}</option>
          {#each $locales as locale}
            <option value={locale}>
              {$t(`settings.app.lang.${locale}`, { default: locale })}
            </option>
          {/each}
          {#if $userSettings.debugInfo}
            <option value="dev">Raw Strings</option>
          {/if}
        </Select>
      </Setting>
      {#if $locale == 'he'}
        <ToggleSetting
          bind:checked={$userSettings.useRtl}
          title={$t('settings.app.lang.useRtl.title')}
        ></ToggleSetting>
      {/if}
    </div>
    <Setting>
      <span slot="title">{$t('settings.app.view.title')}</span>
      <ViewSelect showLabel={false} />
      <p slot="description">
        {#if $userSettings.view == 'list'}
          {$t('settings.app.view.list')}
        {:else if $userSettings.view == 'cozy'}
          {$t('settings.app.view.cozy')}
        {:else if $userSettings.view == 'compact'}
          {$t('settings.app.view.compact')}
        {:else if $userSettings.view == 'card'}
          {$t('settings.app.view.legacy')}
        {/if}
      </p>
    </Setting>
    <Setting optionClass="flex-[2] max-w-full flex-wrap min-w-0">
      <span slot="title">{$t('settings.app.sort.title')}</span>
      <span slot="description">{$t('settings.app.sort.description')}</span>
      <div class="flex max-[500px]:flex-col flex-wrap gap-2 w-max max-w-full">
        <div class="max-w-full">
          <Select bind:value={$userSettings.defaultSort.feed}>
            <span slot="label" class="flex items-center gap-1">
              <Icon src={GlobeAmericas} size="16" mini />
              {$t('filter.location.label')}
            </span>
            <option value="All">{$t('filter.location.all')}</option>
            <option value="Local">{$t('filter.location.local')}</option>
            <option value="Subscribed">
              {$t('filter.location.subscribed')}
            </option>
            <option value="Moderator">{$t('filter.location.moderator')}</option>
          </Select>
        </div>
        <div class="max-w-full">
          <Sort
            bind:selected={$userSettings.defaultSort.sort}
            navigate={false}
          />
        </div>
        <div class="max-w-full">
          <Select bind:value={$userSettings.defaultSort.comments}>
            <span slot="label" class="flex items-center gap-1">
              <Icon src={ChatBubbleOvalLeftEllipsis} size="14" mini />
              {$t('content.comments')}
            </span>

            <option value="Hot">{$t('filter.sort.hot')}</option>
            <option value="Top">{$t('filter.sort.top.label')}</option>
            <option value="New">{$t('filter.sort.new')}</option>
          </Select>
        </div>
      </div>
    </Setting>
    <ToggleSetting
      beta
      bind:checked={$userSettings.infiniteScroll}
      title={$t('settings.app.infiniteScroll.title')}
      description={$t('settings.app.infiniteScroll.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.openLinksInNewTab}
      title={$t('settings.app.postsInNewTab.title')}
      description={$t('settings.app.postsInNewTab.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.displayNames}
      title={$t('settings.app.displayName.title')}
      description={$t('settings.app.displayName.description')}
    />
    <ToggleSetting
      supportedPlatforms={{ desktop: true, tablet: false, mobile: false }}
      bind:checked={$userSettings.newWidth}
      title={$t('settings.app.limitLayoutWidth.title')}
      description={$t('settings.app.limitLayoutWidth.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.randomPlaceholders}
      title={$t('settings.app.placeholders.title')}
      description={$t('settings.app.placeholders.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.expandImages}
      title={$t('settings.app.expandImages.title')}
      description={$t('settings.app.expandImages.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.posts.deduplicateEmbed}
      title={$t('settings.app.duplicateTitles.title')}
      description={$t('settings.app.duplicateTitles.description')}
    />
    <Setting>
      <span slot="title">{$t('settings.app.thumbnailSide.title')}</span>
      <span slot="description">
        {$t('settings.app.thumbnailSide.title')}
      </span>
      <MultiSelect
        options={[true, false]}
        optionNames={[
          $t('settings.app.thumbnailSide.left'),
          $t('settings.app.thumbnailSide.right'),
        ]}
        bind:selected={$userSettings.leftAlign}
      />
    </Setting>
    <Setting itemsClass="flex-col !items-start">
      <span slot="title">{$t('settings.app.font.title')}</span>
      <span slot="description">{$t('settings.app.font.description')}</span>
      <MultiSelect
        options={['inter', 'satoshi/nunito', 'system', 'browser']}
        optionNames={['Inter', 'Satoshi/Nunito', 'System UI', 'Browser Font']}
        bind:selected={$userSettings.font}
      />
    </Setting>
    <Setting>
      <span slot="title">{$t('settings.app.theming.title')}</span>
      <span slot="description">{$t('settings.app.theming.description')}</span>
      <Button href="/theme">
        {$t('settings.app.theming.link')}
        <Icon src={ArrowRight} size="16" mini slot="suffix" />
      </Button>
    </Setting>
    <Setting>
      <span slot="title">{$t('settings.app.translation.title')}</span>
      <span slot="description">
        {$t('settings.app.translation.description')}
      </span>
      <TextInput
        bind:value={$userSettings.translator}
        label={$t('settings.app.translation.instance')}
        pattern={DOMAIN_REGEX_FORMS}
      />
    </Setting>
  </Section>

  <Section title={$t('settings.embeds.title')}>
    <ToggleSetting
      title={$t('settings.embeds.clickToView.title')}
      description={$t('settings.embeds.clickToView.description')}
      bind:checked={$userSettings.embeds.clickToView}
    />
    <Setting>
      <span slot="title">YouTube</span>
      <span slot="description">
        {$t('settings.embeds.youtube.description')}
      </span>
      <Select bind:value={$userSettings.embeds.youtube}>
        <option value="youtube">YouTube</option>
        <option value="invidious">Invidious</option>
        <option value="piped">Piped</option>
      </Select>
    </Setting>
    {#if $userSettings.embeds.youtube == 'invidious'}
      <Setting>
        <span slot="title">{$t('settings.embeds.instance.invidious')}</span>
        <span slot="description">
          {$t('settings.embeds.instance.description')}
        </span>
        <TextInput
          label={$t('settings.embeds.instance.invidious')}
          pattern={DOMAIN_REGEX_FORMS}
          bind:value={$userSettings.embeds.invidious}
        />
      </Setting>
    {/if}
    {#if $userSettings.embeds.youtube == 'piped'}
      <Setting>
        <span slot="title">{$t('settings.embeds.instance.piped')}</span>
        <span slot="description">
          {$t('settings.embeds.instance.description')}
        </span>
        <TextInput
          label={$t('settings.embeds.instance.piped')}
          pattern={DOMAIN_REGEX_FORMS}
          bind:value={$userSettings.embeds.piped}
        />
      </Setting>
    {/if}
  </Section>

  <Section title={$t('settings.lemmy.title')}>
    <ToggleSetting
      bind:checked={$userSettings.posts.showHidden}
      title={$t('settings.lemmy.showHiddenPosts.title')}
      description={$t('settings.lemmy.showHiddenPosts.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.posts.compactFeatured}
      title={$t('settings.lemmy.compactFeatured.title')}
      description={$t('settings.lemmy.compactFeatured.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.markPostsAsRead}
      title={$t('settings.lemmy.markReadPosts.title')}
      description={$t('settings.lemmy.markReadPosts.description')}
    />
    <ToggleSetting
      bind:checked={$userSettings.markReadPosts}
      title={$t('settings.lemmy.fadeReadPosts.title')}
      description={$t('settings.lemmy.fadeReadPosts.title')}
    />
    <ToggleSetting
      bind:checked={$userSettings.crosspostOriginalLink}
      title={$t('settings.lemmy.crosspostMarker.title')}
      description={$t('settings.lemmy.crosspostMarker.description')}
    />
    <Setting>
      <span slot="title">{$t('settings.lemmy.hideSubmissions.title')}</span>
      <span slot="description">
        <p>{$t('settings.lemmy.hideSubmissions.description')}</p>
      </span>
      <div class="flex flex-col items-start gap-4 flex-wrap">
        <Switch bind:checked={$userSettings.hidePosts.deleted}>
          {$t('settings.lemmy.hideSubmissions.deleted')}
        </Switch>
        <Switch bind:checked={$userSettings.hidePosts.removed}>
          {$t('settings.lemmy.hideSubmissions.removed')}
        </Switch>
      </div>
    </Setting>
    <ToggleSetting
      bind:checked={$userSettings.nsfwBlur}
      title={$t('settings.lemmy.nsfwBlur.title')}
      description={$t('settings.lemmy.nsfwBlur.description')}
    />
    <Setting>
      <span slot="title">{$t('settings.lemmy.instances.title')}</span>
      <span slot="description">
        {$t('settings.lemmy.instances.description')}
      </span>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Checkbox bind:checked={$userSettings.showInstances.user}>
          {$t('content.users')}
        </Checkbox>
        <Checkbox bind:checked={$userSettings.showInstances.comments}>
          {$t('content.comments')}
        </Checkbox>
        <Checkbox bind:checked={$userSettings.showInstances.community}>
          {$t('content.communities')}
        </Checkbox>
      </div>
    </Setting>
  </Section>

  <Section title={$t('settings.moderation.title')}>
    <Setting mainClass="md:flex-row flex-col !items-start">
      <span slot="title">{$t('settings.moderation.replyPresets.title')}</span>
      <span slot="description">
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
      {#each $userSettings.moderation.presets as preset, index}
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
              <Icon src={ChevronDown} mini size="16" slot="prefix" />
              {preset.title}
              <Button
                size="square-md"
                rounding="lg"
                class="ml-auto"
                on:click={() => {
                  $userSettings.moderation.presets.splice(index, 1)
                  $userSettings.moderation.presets =
                    $userSettings.moderation.presets
                }}
              >
                <Icon src={Trash} size="16" mini slot="prefix" />
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
                beforePreview={(input) =>
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
          on:click={() => {
            $userSettings.moderation.presets = [
              ...$userSettings.moderation.presets,
              {
                title: `Preset ${$userSettings.moderation.presets.length + 1}`,
                content:
                  'Your submission in *{{post}}* was removed for *{{reason}}*.',
              },
            ]
          }}
        >
          <Icon src={Plus} mini size="16" slot="prefix" />
          Add Preset
        </Button>
      </Material>
    </Setting>
  </Section>

  <Section title={$t('settings.other.title')}>
    <ToggleSetting
      bind:checked={$userSettings.debugInfo}
      title={$t('settings.other.debug.title')}
      description={$t('settings.other.debug.description')}
    />
  </Section>
</div>
