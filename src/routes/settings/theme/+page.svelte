<script lang="ts">
  import { colors, defaultColor } from '$lib/settings'
  import { Button, Material, Modal, TextArea, toast } from 'mono-svelte'
  import Color from './Color.svelte'

  const areKeysEqual = (a: any, b: any) =>
    Object.keys(a).every((k) => b.hasOwnProperty(k))

  let importTheme = {
    text: '',
    open: false,
  }
</script>

<Modal
  title="Import Theme"
  action="Import"
  on:action={async () => {
    try {
      const color = importTheme.text
      if (!(color || undefined)) throw new Error('There was nothing input.')

      const json = JSON.parse(color)
      if (!areKeysEqual(json, defaultColor)) {
        console.log(json, defaultColor)
        throw new Error('Invalid JSON')
      }

      colors.set(json)
      toast({ content: 'Imported theme.' })

      importTheme.open = false
    } catch (e) {
      // @ts-ignore
      toast({ content: e, type: 'error' })
    }
  }}
  bind:open={importTheme.open}
>
  <TextArea label="JSON" bind:value={importTheme.text} />
</Modal>

<div class="flex flex-col gap-2">
  <h1 class="font-bold text-3xl flex flex-row items-center justify-between">
    Theming

    <Button class="w-max" on:click={() => ($colors = {})}>Reset</Button>
  </h1>
  <div class="flex flex-row items-center gap-2">
    <Button
      on:click={() => {
        importTheme.text = ''
        importTheme.open = true
      }}
    >
      Import
    </Button>
    <Button
      on:click={() => {
        navigator?.clipboard?.writeText(JSON.stringify($colors))
        toast({ content: 'Copied theme to clipboard.' })
      }}
    >
      Export
    </Button>
  </div>

  <div class="flex flex-col md:flex-row flex-wrap gap-4">
    <Material class="flex-1">
      <div class="font-bold text-lg mb-2">Light theme</div>
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <Color fallback="bg-white" bind:value={$colors['white']} name="White" />
        <Color
          fallback="bg-slate-25"
          bind:value={$colors['bg-light-25']}
          name="25"
        />
        <Color
          fallback="bg-slate-50"
          bind:value={$colors['bg-light-50']}
          name="50"
        />
        <Color
          fallback="bg-slate-100"
          bind:value={$colors['bg-light-100']}
          name="100"
        />
        <Color
          fallback="bg-slate-200"
          bind:value={$colors['bg-light-200']}
          name="200"
        />
      </div>
    </Material>
    <Material class="flex-1">
      <div class="font-bold text-lg mb-2">Dark theme</div>
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <Color
          fallback="bg-zinc-925"
          bind:value={$colors['bg-dark-925']}
          name="925"
        />
        <Color
          fallback="bg-zinc-950"
          bind:value={$colors['bg-dark-950']}
          name="950"
        />
        <Color fallback="bg-black" bind:value={$colors['black']} name="Black" />
      </div>
    </Material>
    <Material class="flex-1">
      <div class="font-bold text-lg">Primary</div>
      <p class="mb-2">Used for buttons</p>
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <Color
          fallback="bg-primary-100"
          bind:value={$colors['primary-100']}
          name="100"
        />
        <Color
          fallback="bg-primary-900"
          bind:value={$colors['primary-900']}
          name="900"
        />
      </div>
    </Material>
  </div>
</div>
