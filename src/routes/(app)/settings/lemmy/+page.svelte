<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { CommonList } from '$lib/ui/layout'
  import { Switch } from 'mono-svelte'
  import {
    Bars3,
    BookOpen,
    CubeTransparent,
    ExclamationTriangle,
    Eye,
    EyeSlash,
    ServerStack,
    Share,
    User,
  } from 'svelte-hero-icons/dist'
  import Setting from '../Setting.svelte'
  import ToggleSetting from '../ToggleSetting.svelte'
</script>

<CommonList>
  <ToggleSetting
    icon={Eye}
    bind:checked={settings.value.posts.showHidden}
    title={$t('settings.lemmy.showHiddenPosts.title')}
    description={$t('settings.lemmy.showHiddenPosts.description')}
  />
  <ToggleSetting
    icon={Bars3}
    bind:checked={settings.value.posts.compactFeatured}
    title={$t('settings.lemmy.compactFeatured.title')}
    description={$t('settings.lemmy.compactFeatured.description')}
  />
  <ToggleSetting
    icon={BookOpen}
    bind:checked={settings.value.markPostsAsRead}
    title={$t('settings.lemmy.markReadPosts.title')}
    description={$t('settings.lemmy.markReadPosts.description')}
  />
  <ToggleSetting
    icon={CubeTransparent}
    bind:checked={settings.value.markReadPosts}
    title={$t('settings.lemmy.fadeReadPosts.title')}
    description={$t('settings.lemmy.fadeReadPosts.description')}
  />
  <ToggleSetting
    icon={Share}
    bind:checked={settings.value.crosspostOriginalLink}
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
      <Switch bind:checked={settings.value.hidePosts.deleted}>
        {$t('settings.lemmy.hideSubmissions.deleted')}
      </Switch>
      <Switch bind:checked={settings.value.hidePosts.removed}>
        {$t('settings.lemmy.hideSubmissions.removed')}
      </Switch>
    </div>
  </Setting>
  <ToggleSetting
    icon={ExclamationTriangle}
    bind:checked={settings.value.nsfwBlur}
    title={$t('settings.lemmy.nsfwBlur.title')}
    description={$t('settings.lemmy.nsfwBlur.description')}
  />
  <Setting icon={ServerStack}>
    {#snippet title()}
      {$t('settings.lemmy.instances.title')}
    {/snippet}
    {#snippet description()}
      {$t('settings.lemmy.instances.description')}
    {/snippet}
    <div class="flex flex-row flex-wrap items-center gap-4">
      <Switch bind:checked={settings.value.showInstances.user}>
        {$t('content.users')}
      </Switch>
      <Switch bind:checked={settings.value.showInstances.comments}>
        {$t('content.comments')}
      </Switch>
      <Switch bind:checked={settings.value.showInstances.community}>
        {$t('content.communities')}
      </Switch>
    </div>
  </Setting>
  <ToggleSetting
    icon={User}
    bind:checked={settings.value.displayNames}
    title={$t('settings.app.displayName.title')}
    description={$t('settings.app.displayName.description')}
  />
</CommonList>
