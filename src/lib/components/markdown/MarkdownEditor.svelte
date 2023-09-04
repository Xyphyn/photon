<script lang="ts">
  import { profile } from '$lib/auth.js'
  import FileInput from '$lib/components/input/FileInput.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { toast } from '$lib/components/ui/toasts/toasts.js'
  import { uploadImage } from '$lib/lemmy.js'
  import { Button, Modal } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    CodeBracket,
    ExclamationTriangle,
    Icon,
    Link,
    ListBullet,
    Photo,
  } from 'svelte-hero-icons'

  export let images: boolean = true
  export let value: string = ''
  export let label: string | undefined = undefined
  export let previewButton: boolean = false
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
  let loading = false
  let image: FileList | null = null

  async function upload() {
    if (!$profile?.jwt || image == null) return

    loading = true

    try {
      const uploaded = await uploadImage(image[0])

      if (!uploaded) throw new Error('Image upload returned undefined')

      wrapSelection(`![](${uploaded})`, '')

      uploadingImage = false
    } catch (err) {
      toast({
        content: err as any,
        type: 'error',
      })
    }

    loading = false
  }

  let previewing = false

  const shortcuts = {
    KeyB: () => wrapSelection('**', '**'),
    KeyI: () => wrapSelection('*', '*'),
    KeyS: () => wrapSelection('~~', '~~'),
    KeyH: () => wrapSelection('\n# ', ''),
    KeyK: () => wrapSelection('[](', ')'),
    Enter: () => dispatcher('confirm', value),
  }
</script>

{#if uploadingImage && images}
  <Modal bind:open={uploadingImage}>
    <span slot="title">Upload image</span>
    <form class="flex flex-col gap-4" on:submit|preventDefault={upload}>
      <FileInput image bind:files={image} />
      <Button {loading} disabled={loading} submit color="primary" size="lg">
        Upload
      </Button>
    </form>
  </Modal>
{/if}

<div>
  {#if label}
    <div class="block my-1 font-bold text-sm">{label}</div>
  {/if}
  <div
    class="flex flex-col border border-slate-300 dark:border-zinc-800 rounded-md
overflow-hidden focus-within:border-black focus-within:dark:border-white transition-colors"
  >
    {#if previewing}
      <div class="px-3 py-2.5 h-32 overflow-auto text-sm resize-y">
        <Markdown source={beforePreview(value)} />
      </div>
    {:else}
      <!--Toolbar-->
      <div
        class="[&>*]:flex-shrink-0 flex flex-row overflow-auto p-1.5 gap-1.5 {$$props.disabled
          ? 'opacity-60 pointer-events-none'
          : ''}"
      >
        <Button
          on:click={() => wrapSelection('**', '**')}
          title="Bold"
          size="square-md"
        >
          <span class="font-bold">B</span>
        </Button>
        <Button
          on:click={() => wrapSelection('*', '*')}
          title="Italic"
          size="square-md"
        >
          <span class="italic font-bold">I</span>
        </Button>
        <Button
          on:click={() => wrapSelection('[label](url)', '')}
          title="Link"
          size="square-md"
        >
          <Icon src={Link} mini size="16" />
        </Button>
        <Button
          on:click={() => wrapSelection('\n# ', '')}
          title="Header"
          size="square-md"
        >
          <span class="italic font-bold font-serif">H</span>
        </Button>
        <Button
          on:click={() => wrapSelection('~~', '~~')}
          title="Strikethrough"
          size="square-md"
        >
          <span class="line-through font-bold">S</span>
        </Button>
        <Button
          on:click={() => wrapSelection('\n> ', '')}
          title="Quote"
          size="square-md"
        >
          <span class="font-bold font-serif">"</span>
        </Button>
        <Button
          on:click={() => wrapSelection('\n- ', '')}
          title="List"
          size="square-md"
        >
          <Icon src={ListBullet} mini size="16" />
        </Button>
        <Button
          on:click={() => wrapSelection('`', '`')}
          title="Code"
          size="square-md"
        >
          <Icon src={CodeBracket} mini size="16" />
        </Button>
        <Button
          on:click={() =>
            wrapSelection('::: spoiler <spoiler title>\n', '\n:::')}
          title="Spoiler"
          size="square-md"
        >
          <Icon src={ExclamationTriangle} mini size="16" />
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
            <Icon src={Photo} size="16" mini />
          </Button>
        {/if}
      </div>
      <!--Actual text area-->
      <TextArea
        class="bg-inherit border-0 rounded-none"
        bind:value
        bind:item={textArea}
        on:keydown={(e) => {
          if (disabled) return
          if (e.ctrlKey || e.metaKey) {
            // @ts-ignore
            let shortcut = shortcuts[e.code]
            if (shortcut) {
              e.preventDefault()
              shortcut?.()
            }
          }
        }}
        {rows}
        {...$$restProps}
      />
    {/if}
  </div>
  {#if previewButton}
    <div class="mt-2">
      <MultiSelect
        bind:selected={previewing}
        options={[false, true]}
        optionNames={['Edit', 'Preview']}
      />
    </div>
  {/if}
</div>
