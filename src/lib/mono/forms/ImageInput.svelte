<script lang="ts">
  import { DocumentPlus, Icon } from 'svelte-hero-icons'
  import Label from '../forms/Label.svelte'
  import { generateID } from '../forms/helper.js'
  import TextInput from './TextInput.svelte'

  interface Props {
    accept?: string
    files?: FileList | undefined | null
    label?: string | undefined
    id?: string
    url?: string | undefined
    customLabel?: import('svelte').Snippet
  }

  let {
    accept = 'image/*',
    files = $bindable(),
    label = undefined,
    id = generateID(),
    url = undefined,
    customLabel,
  }: Props = $props()

  let dragover = $state(false)

  let previewURL = $derived(files ? URL.createObjectURL(files[0]) : undefined)
</script>

<div class="flex flex-col">
  {#if customLabel || label}
    <Label for={id} text={label} class="mb-1">
      {@render customLabel?.()}
    </Label>
  {/if}
  <label
    class={[
      'flex flex-col items-center justify-center px-8 py-4 mx-auto w-full rounded-xl',
      'border border-slate-200 dark:border-zinc-800 border-dashed hover:border-slate-300 hover:dark:border-zinc-700',
      'cursor-pointer min-h-36 transition-colors bg-white dark:bg-zinc-950',
      dragover && 'border-sky-500 text-sky-500',
    ]}
    ondrop={(event) => {
      event.preventDefault()
      files = event.dataTransfer?.files ?? null
    }}
    ondragover={(event) => {
      event.preventDefault()

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
        dragover = true
      }
    }}
    ondragleave={(e) => {
      e.preventDefault()
      dragover = false
    }}
  >
    {#if files}
      <!-- svelte-ignore a11y_missing_attribute -->
      <img
        src={previewURL}
        onload={() => {
          if (previewURL) URL.revokeObjectURL(previewURL)
        }}
        class="w-full max-w-sm h-full rounded-lg"
      />
    {:else}
      <Icon
        src={DocumentPlus}
        class="text-slate-400 dark:text-zinc-500"
        size="36"
        solid
      />
      <p class="text-slate-600 dark:text-zinc-400 font-medium">Attach a file</p>
    {/if}
    <input type="file" bind:files {accept} class="hidden" />
  </label>
  {#if url != undefined}
    <TextInput
      class="rounded-t-none border-t-0 rounded-xl"
      placeholder="https://example.com/img1.png"
    />
  {/if}
</div>
