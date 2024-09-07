<script lang="ts">
  export let label: string | undefined = undefined
  export let value: string
  export let required: boolean = false

  let textarea: HTMLTextAreaElement

  function adjustHeight() {
    textarea.style.height = 'auto' // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px` // Set height to the scrollHeight
  }
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
    on:input={adjustHeight}
    bind:value
    {required}
    {...$$restProps}
    rows={1}
    class="font-semibold text-2xl focus:outline-none w-full bg-transparent resize-none {$$props.class}"
  />
</label>
