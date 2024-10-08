<script lang="ts">
  import { DocumentPlus, Icon } from 'svelte-hero-icons'
  import { Label, TextInput } from 'mono-svelte'

  export let accept = 'image/*'
  export let files: FileList | undefined | null = null
  export let label: string | undefined = undefined
  export let url: string | undefined = undefined

  let dragover = false

  $: previewURL = files ? URL.createObjectURL(files[0]) : undefined
</script>

<div class="flex flex-col">
  <Label text={label} class="mb-1">
    <slot name="label" />
  </Label>
  <label
    class="flex flex-col items-center px-8 py-4 mx-auto w-full rounded-xl
  border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black
  cursor-pointer min-h-36 transition-colors {dragover
      ? 'border-sky-500 text-sky-500'
      : ''}
  {url != undefined ? 'rounded-b-none' : ''}
  "
    on:drop|preventDefault={(event) => (files = event.dataTransfer?.files)}
    on:dragover|preventDefault={(event) => {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
        dragover = true
      }
    }}
    on:dragleave|preventDefault={() => (dragover = false)}
  >
    {#if files}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src={previewURL}
        on:load={() => {
          if (previewURL) URL.revokeObjectURL(previewURL)
        }}
        class="w-full max-w-sm h-full rounded-lg"
      />
    {:else if url}
      <img src={url} />
    {:else}
      <Icon src={DocumentPlus} class="opacity-50" size="36" />
      <p class="text-sm opacity-50">Attach a file</p>
    {/if}
    <input type="file" bind:files {accept} class="hidden" />
  </label>
  {#if url != undefined}
    <TextInput class="rounded-t-none border-t-0 rounded-xl" />
  {/if}
</div>
