<script lang="ts">
  import Button from '../button/Button.svelte'
  import { generateID } from '../forms/helper.js'
  import { Label } from '../index.js'
  import { Icon, PaperClip } from 'svelte-hero-icons'

  export let accept: string = '*'
  export let id: string = generateID()
  export let files: FileList | null = null
  export let multiple: boolean = false
  export let preview: boolean = true
  export let label: string | undefined = undefined

  $: previewURLs =
    preview && files ? Array.from(files).map(URL.createObjectURL) : undefined
</script>

<div class="flex flex-col gap-1 {$$props.class}">
  {#if $$slots.label || label}
    <Label for={id} text={label}>
      <slot name="label" />
    </Label>
  {/if}
  <label
    class="w-max relative cursor-pointer space-x-2 flex flex-row items-center"
  >
    <slot name="button">
      <Button>Browse</Button>
    </slot>
    {#if previewURLs}
      <div
        class="flex flex-row items-center -space-x-1 hover:space-x-1 z-20 h-8"
      >
        {#each previewURLs as file}
          <!-- svelte-ignore a11y-missing-attribute -->
          <img
            src={file}
            on:load={() => URL.revokeObjectURL(file)}
            alt={file}
            class="w-8 h-8 object-cover rounded-full hover:w-16
            hover:h-16 transition-all border border-slate-200 ring-1
            ring-slate-50 dark:ring-zinc-950 bg-white dark:bg-zinc-950"
          />
        {/each}
      </div>
    {/if}
    <span class="flex flex-row items-center text-slate-600 dark:text-zinc-400">
      <slot name="choose">
        {#if (files ?? []).length == 0}
          No file selected.
        {:else}
          {(files ?? []).length} files selected
        {/if}
      </slot>
    </span>
    <input
      type="file"
      bind:files
      {accept}
      {multiple}
      class="w-full h-full inset-0 opacity-0 absolute cursor-pointer"
    />
  </label>
</div>
