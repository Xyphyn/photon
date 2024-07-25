<script lang="ts">
  import {
    Button,
    Material,
    Modal,
    Note,
    TextArea,
    action,
    modal,
    toast,
  } from 'mono-svelte'
  import {
    ArrowDownTray,
    ArrowPath,
    ArrowUpTray,
    Bookmark,
    CheckCircle,
    Icon,
    Plus,
  } from 'svelte-hero-icons'
  import ColorSwatch from './ColorSwatch.svelte'
  import { t } from '$lib/translations'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import { calculateVars, hexToRgb, theme, themeData } from '$lib/ui/colors'
  import { getDefaultColors } from '$lib/ui/presets'
  import ThemePreset from './ThemePreset.svelte'

  let importing = false
  let importText = ''

  $: defaultColors = getDefaultColors()
</script>

{#if importing}
  <Modal
    bind:open={importing}
    on:action={() => {
      try {
        if (importText == '') {
          throw new Error('Import is empty')
        }
        $theme.colors = JSON.parse(importText)
        toast({ content: $t('message.success'), type: 'success' })
        importing = false
      } catch (err) {
        // @ts-ignore
        toast({ content: err, type: 'error' })
      }
    }}
    title={$t('routes.theme.import')}
    action={$t('routes.theme.import')}
  >
    <TextArea bind:value={importText} style="font-family: monospace;" />
  </Modal>
{/if}

<div class="flex flex-col gap-4 h-full">
  <Header>Theme</Header>
  <div
    class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
    gap-4 overflow-auto max-h-72"
  >
    {#each $themeData.themes as theme}
      <ThemePreset {theme} />
    {/each}
    <button
      on:click={() => {
        const newTheme = {
          id: Math.max(...$themeData.themes.map((t) => t.id)) + 1,
          colors: getDefaultColors(),
          name: `New Theme`,
        }

        $themeData.themes = [...$themeData.themes, newTheme]

        $themeData.currentTheme = newTheme.id
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
  <div class="flex items-center gap-4">
    <Button
      on:click={() => {
        importing = !importing
      }}
      size="lg"
      disabled={$theme.id <= 0}
    >
      <Icon src={ArrowUpTray} size="16" mini />
      {$t('routes.theme.import')}
    </Button>
    <Button
      on:click={() => {
        navigator.clipboard.writeText(JSON.stringify($theme.colors))
        toast({ content: 'Copied theme to clipboard.' })
      }}
      size="lg"
    >
      <Icon src={ArrowDownTray} size="16" mini />
      {$t('routes.theme.export')}
    </Button>
    <Button
      disabled={$theme.id <= 0}
      on:click={() => {
        modal({
          actions: [
            action({
              content: $t('common.cancel'),
              close: true,
            }),
            action({
              action: () => {
                $theme.colors = { other: {}, primary: {}, zinc: {}, slate: {} }
              },
              content: $t('routes.theme.reset'),
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
      {$t('routes.theme.reset')}
    </Button>
  </div>
  {#if $theme.id <= 0}
    <Note>
      {$t('routes.theme.preset.description')}
    </Note>
  {/if}
  <div
    class="relative"
    class:opacity-50={$theme.id <= 0}
    class:pointer-events-none={$theme.id <= 0}
  >
    <Material
      color="transparent"
      class="items-center gap-x-4 color-grid gap-y-2"
    >
      <h1 class="text-2xl font-bold col-span-2">{$t('routes.theme.accent')}</h1>
      <ColorSwatch
        value={$theme.colors.primary?.[900]}
        on:change={(e) => {
          $theme.colors.primary[900] = e.detail
        }}
        backgroundColor={defaultColors.primary[900]}
        on:contextmenu={(e) => {
          e.preventDefault()
          $theme.colors.primary[900] =
            // @ts-ignore
            defaultColors.primary[900]

          return true
        }}
        class="!w-12 !h-12 col-span-1"
      />
      <ColorSwatch
        value={$theme.colors.primary?.[100]}
        on:change={(e) => {
          $theme.colors.primary[100] = e.detail
        }}
        backgroundColor={defaultColors.primary[100]}
        on:contextmenu={(e) => {
          e.preventDefault()
          $theme.colors.primary[100] =
            // @ts-ignore
            defaultColors.primary[100]

          return true
        }}
        class="!w-12 !h-12 col-span-1"
      />
      <span class="font-semibold text-base">
        {$t('nav.menu.colorscheme.light')}
      </span>
      <span class="font-semibold text-base">
        {$t('nav.menu.colorscheme.dark')}
      </span>
    </Material>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {#each Object.entries(defaultColors) as [category, value]}
        <Material color="transparent" class="flex flex-col gap-2">
          <h1 class="capitalize font-semibold text-lg">{category}</h1>
          <div class="flex flex-row gap-1 flex-wrap items-center space-evenly">
            {#each Object.entries(value) as [shade, color]}
              <div class="flex flex-col gap-0.5 w-10 group">
                <!--@ts-ignore-->
                <ColorSwatch
                  bind:value={$theme.colors[category][shade]}
                  on:change={(e) => {
                    $theme.colors[category][shade] = e.detail
                  }}
                  on:contextmenu={(e) => {
                    e.preventDefault()
                    $theme.colors[category][shade] =
                      // @ts-ignore
                      defaultColors[category][shade]

                    return true
                  }}
                />
                <span class="font-medium capitalize">{shade}</span>
              </div>
            {/each}
          </div>
        </Material>
      {/each}
    </div>
  </div>
  <div
    class="flex items-center gap-2 sm:gap-8 flex-col sm:flex-row mt-auto mx-auto text-sm text-slate-600 dark:text-zinc-400"
  >
    <span>Slate is for light theme, Zinc is for dark</span>
    <span>
      You can share themes at <a
        href="/c/photon@lemdro.id"
        class="text-sky-600 dark:text-sky-500 hover:underline"
      >
        photon@lemdro.id
      </a>
    </span>
  </div>
</div>

<style>
  :global(.color-grid) {
    display: grid;
    grid-template-columns: min-content min-content;
  }
</style>
