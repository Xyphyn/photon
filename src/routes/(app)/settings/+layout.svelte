<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { defaultSettings, settings.value } from '$lib/app/settings.svelte'
  import { Header, Tabs } from '$lib/ui/layout'
  import { action, Button, Modal, modal, TextArea, toast } from 'mono-svelte'
  import { ArrowDownTray, ArrowPath, ArrowUpTray } from 'svelte-hero-icons/dist'

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
          throw new Error('import failed')
        }
        const parsed = JSON.parse(importText)
        const merged = { ...defaultSettings, ...parsed }

        Object.assign(settings.value, merged)

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
/>

<Header pageHeader class="text-3xl font-bold flex justify-between">
  {$t('settings.title')}
  {#snippet extended()}
    <div class="flex items-center tracking-normal gap-2">
      <Button
        onclick={() => {
          importText = ''
          importing = true
        }}
        icon={ArrowDownTray}
        size="lg"
      >
        {$t('settings.import')}
      </Button>
      <Button
        onclick={() => {
          const json = JSON.stringify(settings.value)
          navigator?.clipboard?.writeText?.(json)
          toast({ content: $t('toast.copied') })
        }}
        icon={ArrowUpTray}
        size="lg"
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
                action: () => Object.assign(settings.value, defaultSettings),
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
        icon={ArrowPath}
        size="lg"
      >
        {$t('settings.reset')}
      </Button>
    </div>
  {/snippet}
</Header>

{@render children?.()}
