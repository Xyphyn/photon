<script lang="ts">
  import { t } from '$lib/translations'
  import { calculateVars, themeData, type Theme } from '$lib/ui/colors'
  import { Button, Material, modal } from 'mono-svelte'
  import { CheckCircle, Icon, Trash } from 'svelte-hero-icons'

  export let theme: Theme

  let editing
</script>

<button class="h-full" on:click={() => ($themeData.currentTheme = theme.id)}>
  <Material
    padding="none"
    class="{theme.id == $themeData.currentTheme
      ? 'ring-2 ring-inset ring-primary-900 dark:ring-primary-100'
      : ''} flex relative cursor-pointer h-full flex-col text-left p-0.5"
  >
    <div
      style="{calculateVars(theme)};"
      class="h-20 w-full rounded-lg rounded-b-none flex flex-row flex-wrap p-3 gap-2
            bg-slate-25 dark:bg-zinc-925"
    >
      <div class="text-slate-900 dark:text-zinc-100 text-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </div>
      <div
        class="bg-white dark:bg-zinc-900 w-8 h-4 rounded-sm border border-slate-200 dark:border-zinc-800"
      />
      <div
        class="w-3 h-3 bg-primary-900 dark:bg-primary-100 rounded-full ml-auto"
      />
    </div>
    {#if theme.id == $themeData.currentTheme}
      <Icon
        src={CheckCircle}
        size="20"
        solid
        class="absolute top-0 right-0 m-2 text-primary-900 dark:text-primary-100"
      />
    {/if}
    <div class="px-4 py-2 flex items-center gap-1 justify-between">
      <span class="font-medium text-lg font-display">{theme.name}</span>
      <Button
        color="ghost"
        size="square-md"
        on:click={() => {
          modal({
            actions: [
              {
                close: true,
                content: $t('common.cancel'),
                type: 'secondary',
                action: () => {},
              },
              {
                close: true,
                content: $t('routes.theme.preset.delete.confirm'),
                type: 'danger',
                action: () => {
                  const index = $themeData.themes
                    .map((t) => t.id)
                    .indexOf(theme.id)

                  $themeData.themes = $themeData.themes.toSpliced(index, 1)
                },
              },
            ],
            type: 'error',
            body: '',
            title: $t('routes.theme.preset.delete.title'),
          })
        }}
      >
        <Icon src={Trash} size="16" mini slot="prefix" />
      </Button>
    </div>
  </Material>
</button>
