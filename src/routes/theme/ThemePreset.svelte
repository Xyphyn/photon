<script lang="ts">
  import { t } from '$lib/app/i18n'
  import { type Theme, theme as themeData } from '$lib/app/theme/theme.svelte'
  import FreeTextInput from '$lib/ui/form/FreeTextInput.svelte'
  import { action, Button, Material, modal } from 'mono-svelte'
  import { CheckCircle, Icon, Trash } from 'svelte-hero-icons/dist'

  interface Props {
    theme: Theme
  }

  let { theme = $bindable() }: Props = $props()

  let selected = $derived(theme.id == themeData.data.currentTheme)
  let editingName = $state(false)
</script>

<button class="h-full" onclick={() => (themeData.data.currentTheme = theme.id)}>
  <Material
    padding="none"
    rounding="none"
    color="default"
    class={[
      'rounded-2xl flex relative cursor-pointer h-full flex-col text-left p-0.5',
    ]}
  >
    <div
      class={['h-20 w-full rounded-xl flex flex-row flex-wrap p-3 gap-2']}
      style="background-color: rgb({theme.colors[
        'zinc'
      ][900]}); color: rgb({theme.colors['zinc'][50]});"
    >
      <div style="color: rgb({theme.colors['zinc'][50]})" class="text-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </div>
      <div
        class="w-3 h-3 rounded-full ml-auto"
        style="background-color: rgb({theme.colors['primary'][100]})"
      ></div>
    </div>
    {#if theme.id == themeData.data.currentTheme}
      <Icon
        src={CheckCircle}
        size="20"
        solid
        class="absolute top-0 right-0 m-2 text-primary-100"
      />
    {/if}
    <div class="px-4 py-2 flex items-center gap-1 justify-between">
      <FreeTextInput
        bind:value={theme.name}
        disabled={theme.id <= 0}
        class={[
          'text-left font-medium text-lg font-display disabled:pointer-events-none',
        ]}
      >
        {theme.name}
      </FreeTextInput>
      {#if theme.id > 0}
        <Button
          color="ghost"
          size="square-md"
          class="shrink-0"
          rounding="xl"
          onclick={() => {
            modal({
              actions: [
                action({
                  close: true,
                  type: 'secondary',
                  content: $t('common.cancel'),
                }),
                action({
                  close: true,
                  content: $t('routes.theme.preset.delete.confirm'),
                  type: 'danger',
                  action: () => {
                    const index = themeData.data.themes
                      .map((t) => t.id)
                      .indexOf(theme.id)

                    themeData.data.themes = themeData.data.themes.toSpliced(
                      index,
                      1,
                    )
                    if (theme.id == themeData.data.currentTheme) {
                      themeData.data.currentTheme = 0
                    }
                  },
                }),
              ],
              type: 'error',
              body: '',
              title: $t('routes.theme.preset.delete.title'),
            })
          }}
          icon={Trash}
        ></Button>
      {/if}
    </div>
  </Material>
</button>
