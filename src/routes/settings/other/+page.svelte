<script lang="ts">
  import CommonList from '$comp/ui/layout/CommonList.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte'
  import { Bars3, BugAnt } from 'svelte-hero-icons'
  import ToggleSetting from '../ToggleSetting.svelte'
</script>

<CommonList>
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
</CommonList>
