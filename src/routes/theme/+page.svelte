<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { getDefaultColors } from '$lib/app/theme/presets'
  import { theme as themeData } from '$lib/app/theme/theme.svelte'
  import { Header } from '$lib/ui/layout'
  import {
    action,
    Button,
    Material,
    Modal,
    modal,
    Note,
    TextArea,
    toast,
  } from 'mono-svelte'
  import {
    ArrowDownTray,
    ArrowPath,
    ArrowUpTray,
    Icon,
    Plus,
  } from 'svelte-hero-icons/dist'
  import ColorSwatch from './ColorSwatch.svelte'
  import ThemePreset from './ThemePreset.svelte'

  let importing = $state(false)
  let importText = $state('')

  let defaultColors = $derived(getDefaultColors())
</script>

<svelte:head>
  <title>{$t('routes.theme.title')}</title>
</svelte:head>

{#if importing}
  <Modal
    bind:open={importing}
    onaction={() => {
      try {
        if (importText == '') {
          throw new Error('import failed')
        }
        themeData.current.colors = JSON.parse(importText)
        toast({ content: $t('message.success'), type: 'success' })
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

<Header pageHeader>
  {$t('routes.theme.title')}

  {#snippet extended()}
    <div class="flex items-center gap-2">
      <Button
        onclick={() => {
          importing = !importing
        }}
        size="lg"
        disabled={themeData.current.id <= 0}
      >
        <Icon src={ArrowUpTray} size="16" mini />
        {$t('settings.import')}
      </Button>
      <Button
        onclick={() => {
          navigator.clipboard.writeText(
            JSON.stringify(themeData.current.colors),
          )
          toast({ content: 'Copied theme to clipboard.' })
        }}
        size="lg"
      >
        <Icon src={ArrowDownTray} size="16" mini />
        {$t('settings.export')}
      </Button>
      <Button
        disabled={themeData.current.id <= 0}
        onclick={() => {
          modal({
            actions: [
              action({
                content: $t('common.cancel'),
                close: true,
              }),
              action({
                action: () => {
                  themeData.current.colors = {
                    other: {},
                    primary: {},
                    zinc: {},
                    slate: {},
                  }
                },
                content: $t('settings.reset'),
                close: true,
                type: 'danger',
              }),
            ],
            title: $t('routes.theme.resetWarning.title'),
            body: $t('routes.theme.resetWarning.description'),
          })
        }}
        size="lg"
      >
        <Icon src={ArrowPath} size="16" mini />
        {$t('settings.reset')}
      </Button>
    </div>
  {/snippet}
</Header>
<div class="flex flex-col gap-4 h-full">
  <h3
    class="relative -mb-7 z-10 left-6 font-medium text-sm bg-slate-25 dark:bg-zinc-925 w-max px-1"
  >
    {$t('routes.theme.preset.presets')}
  </h3>
  <Material
    color="uniform"
    rounding="2xl"
    class="overflow-auto max-h-96 relative @container"
  >
    <div
      class="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4
    gap-2"
    >
      {#each themeData.data.themes as theme, index (theme.id)}
        <ThemePreset bind:theme={themeData.data.themes[index]} />
      {/each}
      <button
        onclick={() => {
          const newTheme = {
            id: Math.max(...themeData.data.themes.map((t) => t.id)) + 1,
            colors: getDefaultColors(),
            name: $t('routes.theme.preset.new'),
          }

          themeData.data.themes = [...themeData.data.themes, newTheme]

          themeData.data.currentTheme = newTheme.id
        }}
      >
        <Material
          color="none"
          padding="sm"
          class="border-dashed border-2 border-slate-400 dark:border-zinc-600
        text-slate-400 dark:text-zinc-600 hover:border-slate-600 dark:hover:border-zinc-400
        grid place-items-center w-14 h-14"
          rounding="xl"
        >
          <Icon src={Plus} size="28" />
        </Material>
      </button>
    </div>
  </Material>
  {#if themeData.current.id <= 0}
    <Note>
      {$t('routes.theme.preset.description')}
    </Note>
  {/if}
  <div
    class="relative"
    class:opacity-50={themeData.current.id <= 0}
    class:pointer-events-none={themeData.current.id <= 0}
  >
    <Material
      color="uniform"
      class="items-center gap-x-4 color-grid gap-y-2"
      rounding="2xl"
    >
      <Header size="sm" style="grid-column: span 2 / span 2;">
        {$t('routes.theme.accent')}
      </Header>
      <ColorSwatch
        value={themeData.current.colors.primary?.[900]}
        onchange={(e) => {
          themeData.current.colors.primary[900] = e
        }}
        oncontextmenu={(e) => {
          e.preventDefault()
          themeData.current.colors.primary[900] = defaultColors.primary[900]

          return true
        }}
        class="w-12! h-12! col-span-1"
      />
      <ColorSwatch
        value={themeData.current.colors.primary?.[100]}
        onchange={(e) => {
          themeData.current.colors.primary[100] = e
        }}
        oncontextmenu={(e) => {
          e.preventDefault()
          themeData.current.colors.primary[100] = defaultColors.primary[100]

          return true
        }}
        class="w-12! h-12! col-span-1"
      />
      <span class="font-medium text-sm -mt-2">
        {$t('nav.menu.colorscheme.light')}
      </span>
      <span class="font-medium text-sm -mt-2">
        {$t('nav.menu.colorscheme.dark')}
      </span>
    </Material>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {#each Object.entries(defaultColors) as [category, value] (category)}
        <Material rounding="2xl" color="uniform" class="flex flex-col gap-2">
          <Header
            class="capitalize"
            size="sm"
            style="grid-column: span 2 / span 2;"
          >
            {category}
          </Header>
          <div class="flex flex-row gap-1 flex-wrap items-center space-evenly">
            {#each Object.entries(value) as [shade] (shade)}
              <div class="flex flex-col gap-0.5 w-10 group">
                <!--@ts-ignore-->
                <ColorSwatch
                  bind:value={themeData.current.colors[category][shade]}
                  onchange={(e) => {
                    themeData.current.colors[category][shade] = e
                  }}
                  oncontextmenu={(e) => {
                    e.preventDefault()
                    themeData.current.colors[category][shade] =
                      defaultColors[category][shade]

                    return true
                  }}
                />
                <span class="font-medium -mt-1 capitalize">{shade}</span>
              </div>
            {/each}
          </div>
        </Material>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(.color-grid) {
    display: grid;
    grid-template-columns: min-content min-content;
  }
</style>
