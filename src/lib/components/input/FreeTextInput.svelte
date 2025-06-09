<script lang="ts">
  import { tick } from 'svelte'
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  let textarea: HTMLTextAreaElement | undefined = $state()

  async function adjustHeight() {
    await tick()
    if (textarea) {
      textarea.style.height = 'auto' // Reset height to auto to calculate new height
      textarea.style.height = `${textarea.scrollHeight}px` // Set height to the scrollHeight
    }
  }
  interface Props extends HTMLTextareaAttributes {
    label?: string | undefined
    value: string
    required?: boolean
    class?: string
  }

  let {
    label = undefined,
    value = $bindable(),
    required = false,
    class: clazz = '',
    ...rest
  }: Props = $props()

  $effect(() => {
    if (value) adjustHeight()
  })
</script>

<label class="w-full">
  {#if label}
    <div class="text-sm font-medium">
      {label}
      {#if required}
        <span class="text-red-600 font-bold">*</span>
      {/if}
    </div>
  {/if}
  <textarea
    bind:this={textarea}
    oninput={() => adjustHeight()}
    bind:value
    {required}
    {...rest}
    rows={1}
    class="font-semibold text-2xl focus:outline-hidden w-full bg-transparent resize-none {clazz}"
  ></textarea>
</label>
