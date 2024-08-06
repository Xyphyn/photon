<script lang="ts">
  import { profile } from '$lib/auth.js'
  import MultiSelect from '$lib/components/input/Switch.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { t } from '$lib/translations'
  import { uploadImage } from '$lib/util.js'
  import { ImageInput, toast } from 'mono-svelte'
  import { Button, Label, Modal, TextArea } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    Bold,
    CodeBracket,
    DocumentPlus,
    ExclamationTriangle,
    H1,
    Icon,
    Italic,
    Link,
    ListBullet,
    Photo,
    Strikethrough,
  } from 'svelte-hero-icons'
  import ImageUploadModal from '../lemmy/modal/ImageUploadModal.svelte'

  export let images: boolean = true
  export let value: string = ''
  export let label: string | undefined = undefined
  export let previewButton: boolean = true
  export let tools: boolean = true
  export let disabled: boolean = false
  export let rows: number = 4

  export let beforePreview: (input: string) => string = (input) => input

  const dispatcher = createEventDispatcher<{ confirm: string }>()

  let textArea: HTMLTextAreaElement

  function replaceTextAtIndices(
    str: string,
    startIndex: number,
    endIndex: number,
    replacement: string
  ) {
    return str.substring(0, startIndex) + replacement + str.substring(endIndex)
  }

  function wrapSelection(start: string, end: string) {
    const startPos = textArea.selectionStart
    const endPos = textArea.selectionEnd

    const substring = textArea.value.substring(startPos, endPos)
    let newText = `${start}${substring}${end}`

    textArea.value = replaceTextAtIndices(
      textArea.value,
      startPos,
      endPos,
      newText
    )

    textArea.focus()
    textArea.selectionStart = startPos + start.length
    textArea.selectionEnd = endPos + start.length

    value = textArea.value
  }

  let uploadingImage = false
  let image: any

  export let previewing = false

  const shortcuts = {
    KeyB: () => wrapSelection('**', '**'),
    KeyI: () => wrapSelection('*', '*'),
    KeyS: () => wrapSelection('~~', '~~'),
    KeyH: () => wrapSelection('\n# ', ''),
    KeyK: () => wrapSelection('[](', ')'),
    Enter: (e: any) => {
      dispatcher('confirm', value)
      const newEvent = new Event('submit', { cancelable: true })
      e.target.form.dispatchEvent(newEvent)
    },
  }
</script>

{#if uploadingImage && images}
  <ImageUploadModal
    bind:open={uploadingImage}
    bind:image
    on:upload={(e) => {
      e.detail.forEach((i) => {
        wrapSelection(`![](${i})\n\n`, '')
      })
    }}
  />
{/if}

<div>
  {#if label || $$slots.label}
    <Label>
      {#if label}
        {label}
      {:else if $$slots.label}
        <slot name="label" />
      {/if}
    </Label>
  {/if}
  <div
    class="flex flex-col border border-slate-200 border-b-slate-300 dark:border-t-zinc-700/70 dark:border-zinc-800
    focus-within:border-primary-900 focus-within:dark:border-primary-100 focus-within:ring ring-slate-300
    dark:ring-zinc-700 rounded-xl
overflow-hidden transition-colors {$$props.class}"
    class:mt-1={label}
  >
    {#if previewing}
      <div
        class="px-3 py-2.5 overflow-auto text-sm resize-y bg-white dark:bg-zinc-950"
        style="height: {rows * 2}em"
      >
        <Markdown source={beforePreview(value)} />
      </div>
    {:else}
      {#if tools}
        <!--Toolbar-->
        <div
          class="[&>*]:flex-shrink-0 flex flex-row overflow-auto p-1.5 gap-1.5 border-b
          border-slate-200 dark:border-zinc-900 {$$props.disabled
            ? 'opacity-60 pointer-events-none'
            : ''}"
        >
          <Button
            on:click={() => wrapSelection('**', '**')}
            title="Bold"
            size="square-md"
          >
            <Icon src={Bold} size="16" mini />
          </Button>
          <Button
            on:click={() => wrapSelection('*', '*')}
            title="Italic"
            size="square-md"
          >
            <Icon src={Italic} size="16" micro />
          </Button>
          <Button
            on:click={() => wrapSelection('[', '](https://example.com)')}
            title="Link"
            size="square-md"
          >
            <Icon src={Link} size="16" micro />
          </Button>
          <Button
            on:click={() => wrapSelection('\n# ', '')}
            title="Header"
            size="square-md"
          >
            <Icon src={H1} size="16" micro />
          </Button>
          <Button
            on:click={() => wrapSelection('~~', '~~')}
            title="Strikethrough"
            size="square-md"
          >
            <Icon src={Strikethrough} size="16" micro />
          </Button>
          <Button
            on:click={() => wrapSelection('\n> ', '')}
            title="Quote"
            size="square-md"
          >
            <span class="font-bold font-serif text-lg">"</span>
          </Button>
          <Button
            on:click={() => wrapSelection('\n- ', '')}
            title="List"
            size="square-md"
          >
            <Icon src={ListBullet} micro size="16" />
          </Button>
          <Button
            on:click={() => wrapSelection('`', '`')}
            title="Code"
            size="square-md"
          >
            <Icon src={CodeBracket} micro size="16" />
          </Button>
          <Button
            on:click={() =>
              wrapSelection('::: spoiler <spoiler title>\n', '\n:::')}
            title="Spoiler"
            size="square-md"
          >
            <Icon src={ExclamationTriangle} micro size="16" />
          </Button>
          <Button
            on:click={() => wrapSelection('~', '~')}
            title="Subscript"
            size="square-md"
          >
            <span class="font-bold">
              X
              <sub>1</sub>
            </span>
          </Button>
          <Button
            on:click={() => wrapSelection('^', '^')}
            title="Superscript"
            size="square-md"
          >
            <span class="font-bold">
              X
              <sup>1</sup>
            </span>
          </Button>
          {#if images}
            <Button
              on:click={() => (uploadingImage = !uploadingImage)}
              title="Image"
              size="square-md"
            >
              <Icon src={Photo} size="16" micro />
            </Button>
          {/if}
        </div>
      {/if}
      <!--Actual text area-->
      <TextArea
        class="bg-inherit z-0 border-0 rounded-none !ring-0 focus:!ring-transparent !transition-none"
        bind:value
        bind:element={textArea}
        on:keydown={(e) => {
          if (disabled) return
          if (e.ctrlKey || e.metaKey) {
            // @ts-ignore
            let shortcut = shortcuts[e.code]
            if (shortcut) {
              e.preventDefault()
              shortcut?.(e)
            }
          }
        }}
        on:focus
        on:paste={(e) => {
          if (!e.clipboardData?.files) return
          const files = Array.from(e.clipboardData.files)
          if (files[0]?.type.startsWith('image/')) {
            image = e.clipboardData.files[0]
            uploadingImage = true
          }
        }}
        {rows}
        {...$$restProps}
      />
    {/if}

    {#if previewButton}
      <div class="p-2 flex items-center w-full bg-white dark:bg-zinc-950">
        {#if previewButton}
          <MultiSelect
            bind:selected={previewing}
            options={[false, true]}
            optionNames={[$t('form.edit'), $t('form.preview')]}
          />
        {/if}
        <slot />
      </div>
    {/if}
  </div>
</div>
