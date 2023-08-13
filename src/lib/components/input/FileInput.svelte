<script lang="ts">
  import { DocumentPlus, Icon } from 'svelte-hero-icons'

  export let accept = 'image/*,video/*'
  export let multiple = false
  export let files: FileList | null | undefined = null
  export let image = false
  export let label: string | undefined = undefined

  let previewURL = ''
  let dragover = false

  $: if (files) {
    previewURL = URL.createObjectURL(files[0])
  }
</script>

<div>
  {#if label}
    <span class="block my-1 text-sm font-bold">{label}</span>
  {/if}
  <label
    class="flex flex-col items-center px-8 py-4 mx-auto w-full rounded-lg
  border border-slate-300 dark:border-zinc-700 bg-white dark:bg-black
  cursor-pointer min-h-36 transition-colors {dragover
      ? 'border-sky-500 text-sky-500'
      : ''}
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
    {#if image && files}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src={previewURL}
        on:load={() => {
          if (previewURL) URL.revokeObjectURL(previewURL)
        }}
        class="w-full max-w-sm h-full rounded-lg"
      />
    {:else}
      <Icon src={DocumentPlus} class="opacity-50" size="36" />
      <p class="text-sm opacity-50">Attach a file</p>
    {/if}
    <input type="file" bind:files {accept} class="hidden" {multiple} />
  </label>
</div>
