<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let label: string = ''
  export let type: 'text' | 'password' | 'email' | null | undefined = 'text'
  export let placeholder: string = ''
  export let value: string = ''
  export let maxlength: number = -1

  function typeAction(node: Node) {
    // @ts-ignore
    node.type = type
  }

  let clazz = ''
  export { clazz as class }

  const dispatcher = createEventDispatcher()
</script>

<label class="flex flex-col items-center {clazz}">
  {#if label != ''}
    <span
      class="font-bold text-sm text-left mb-1 cursor-pointer w-max self-start"
    >
      {label}
    </span>
  {/if}
  <input
    use:typeAction
    bind:value
    on:input={(e) => dispatcher('input', e)}
    {placeholder}
    {maxlength}
    class="w-full px-3 text-sm py-2.5 bg-transparent border border-black/20
    dark:border-white/20 dark:focus:border-white focus:outline-none
    focus:border-black transition-colors rounded-md {clazz}"
  />
</label>
