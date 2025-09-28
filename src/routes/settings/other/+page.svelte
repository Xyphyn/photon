<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { settings } from '$lib/app/settings.svelte'
  import { CommonList } from '$lib/ui/layout'
  import { Bars3, BugAnt } from 'svelte-hero-icons/dist'
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
