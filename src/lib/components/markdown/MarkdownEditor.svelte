<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import TextArea from '$lib/components/input/TextArea.svelte'
  import {
    CodeBracket,
    ExclamationTriangle,
    Icon,
    Link,
    ListBullet,
  } from 'svelte-hero-icons'

  export let images: boolean = true
  export let value: string = ''

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
  }
</script>

<div
  class="flex flex-col border border-slate-200 dark:border-zinc-800 rounded-md
overflow-hidden"
>
  <!--Toolbar-->
  <div class="flex flex-row overflow-auto p-1.5 gap-1.5">
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
      on:click={() => wrapSelection('::: spoiler <spoiler title>\n', '\n:::')}
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
  </div>
  <!--Actual text area-->
  <TextArea
    class="bg-inherit border-0 rounded-none"
    bind:value
    bind:item={textArea}
    {...$$restProps}
  />
</div>
