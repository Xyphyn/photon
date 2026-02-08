<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { defaultSettings, settings } from '$lib/app/settings.svelte'
  import { Header } from '$lib/ui/layout'
  import TabbedLayoutShell from '$lib/ui/layout/pages/TabbedLayoutShell.svelte'
  import { action, Button, Modal, modal, TextArea, toast } from 'mono-svelte'
  import {
    ArrowDownTray,
    ArrowPath,
    ArrowUpTray,
    AtSymbol,
    Cog,
    EllipsisHorizontal,
    RectangleStack,
    ShieldCheck,
  } from 'svelte-hero-icons/dist'

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

<!--TODO use route ID instead of pathname-->
<TabbedLayoutShell
  baseRoute="/settings"
  routes={[
    {
      href: '/settings/app',
      name: $t('settings.app.title'),
      icon: Cog,
    },
    {
      href: '/settings/lemmy',
      name: $t('settings.lemmy.title'),
      icon: AtSymbol,
    },
    {
      href: '/settings/embeds',
      name: $t('settings.embeds.title'),
      icon: RectangleStack,
    },
    {
      href: '/settings/moderation',
      name: $t('settings.moderation.title'),
      icon: ShieldCheck,
    },
    {
      href: '/settings/other',
      name: $t('settings.other.title'),
      icon: EllipsisHorizontal,
    },
  ]}
>
  {#snippet header()}
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
              const json = JSON.stringify(settings)
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
            icon={ArrowPath}
            size="lg"
          >
            {$t('settings.reset')}
          </Button>
        </div>
      {/snippet}
    </Header>
  {/snippet}

  {@render children?.()}
</TabbedLayoutShell>
