<script lang="ts">
  import { Header } from '$comp/ui/layout'
  import Tabs from '$comp/ui/layout/pages/Tabs.svelte'
  import { t } from '$lib/i18n/translations'
  import { defaultSettings, settings } from '$lib/settings.svelte'
  import { action, Button, Modal, modal, toast } from 'mono-svelte'
  import TextArea from 'mono-svelte/forms/TextArea.svelte'
  import { ArrowDownTray, ArrowPath, ArrowUpTray } from 'svelte-hero-icons'

  let { children } = $props()
  let importing = $state(false)
  let importText = $state('')
</script>

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
    title={$t('settings.import')}
    action={$t('settings.import')}
  >
    <TextArea bind:value={importText} style="font-family: monospace;" />
  </Modal>
{/if}

<svelte:head>
  <title>{$t('settings.title')}</title>
</svelte:head>

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
        icon={ArrowDownTray}
      >
        {$t('settings.import')}
      </Button>
      <Button
        onclick={() => {
          const json = JSON.stringify(settings)
          navigator?.clipboard?.writeText?.(json)
          toast({ content: $t('toast.copied') })
        }}
        rounding="pill"
        icon={ArrowUpTray}
      >
        {$t('settings.export')}
      </Button>
      <Button
        onclick={() => {
          modal({
            title: $t('settings.reset'),
            body: $t('toast.resetSettings'),
            actions: [
              action({
                action: () => Object.assign(settings, defaultSettings),
                close: true,
                type: 'danger',
                content: $t('settings.reset'),
              }),
              action({
                content: $t('common.cancel'),
              }),
            ],
          })
        }}
        rounding="pill"
        icon={ArrowPath}
      >
        {$t('settings.reset')}
      </Button>
    </div>
  {/snippet}
</Header>

<Tabs
  routes={[
    {
      href: '/settings/app',
      name: $t('settings.app.title'),
    },
    {
      href: '/settings/lemmy',
      name: $t('settings.lemmy.title'),
    },
    {
      href: '/settings/embeds',
      name: $t('settings.embeds.title'),
    },
    {
      href: '/settings/moderation',
      name: $t('settings.moderation.title'),
    },
    {
      href: '/settings/other',
      name: $t('settings.other.title'),
    },
  ]}
  style="subpage"
/>

{@render children?.()}
