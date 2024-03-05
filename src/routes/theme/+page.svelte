<script lang="ts">
  import { Button, Material, Modal, TextArea, toast } from 'mono-svelte'
  import { defaultColors, type Colors, colors } from '$lib/ui/colors'
  import { ArrowDownTray, ArrowUpTray, Bookmark, Icon } from 'svelte-hero-icons'

  const c = defaultColors

  const svelteIntellisenseSucks = (): (keyof Colors)[] =>
    Object.keys(c) as (keyof Colors)[]

  let importing = false
  let importText = ''
</script>

{#if importing}
  <Modal
    bind:open={importing}
    on:action={() => {
      try {
        if (importText == '') {
          throw new Error('Import is empty')
        }
        $colors = JSON.parse(importText)
        toast({ content: 'Import successful', type: 'success' })
        importing = false
      } catch (err) {
        // @ts-ignore
        toast({ content: err, type: 'error' })
      }
    }}
    title="Import"
    action="Import"
  >
    <TextArea bind:value={importText} style="font-family: monospace;" />
  </Modal>
{/if}

<div class="flex flex-col gap-4 h-full">
  <h1 class="font-bold text-3xl">Theme</h1>
  <div class="flex items-center gap-4">
    <Button
      on:click={() => {
        importing = !importing
      }}
      size="lg"
    >
      <Icon src={ArrowUpTray} size="16" mini />
      Import
    </Button>
    <Button
      on:click={() => {
        navigator.clipboard.writeText(JSON.stringify($colors))
        toast({ content: 'Copied theme to clipboard.' })
      }}
      size="lg"
    >
      <Icon src={ArrowDownTray} size="16" mini />
      Export
    </Button>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
    {#each svelteIntellisenseSucks() as category}
      <Material class="flex flex-col gap-2">
        <h1 class="capitalize font-semibold text-lg">{category}</h1>
        <div class="flex flex-row gap-1 flex-wrap items-center space-evenly">
          {#each Object.keys(c[category]) as shade}
            <div class="flex flex-col gap-0.5 w-10 group">
              <div
                class="w-full h-8 relative rounded-md border dark:border-zinc-600 hover:dark:border-zinc-400
                transition-colors"
                style="background-color: {defaultColors[category][shade]}"
              >
                <input
                  class="rounded-md border cursor-pointer absolute top-0 left-0 w-full h-full opacity-0"
                  type="color"
                  bind:value={$colors[category][shade]}
                />
              </div>
              <span class="font-medium capitalize">{shade}</span>
            </div>
          {/each}
        </div>
      </Material>
    {/each}
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
