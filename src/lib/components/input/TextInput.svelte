<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let label: string = ''
  export let type: 'text' | 'password' | 'email' | null | undefined = 'text'
  export let value: string = ''
  export let required = false

  function typeAction(node: Node) {
    // @ts-ignore
    node.type = type
  }

  const dispatcher = createEventDispatcher()

  let className = `
    ${value.length != 0 ? 'invalid:border-red-400' : ''}
    w-full px-3 text-sm py-2.5 bg-white dark:bg-zinc-950
    border border-slate-300 dark:border-zinc-700 dark:focus:border-white
    focus:outline-none focus:border-black transition-colors rounded-md disabled:bg-slate-200 disabled:bg-zinc-800 disabled:opacity-70
    ${$$props.class}
  `
</script>

<label class="flex flex-col items-center {$$props.class}">
  {#if label != ''}
    <span
      class="font-bold text-sm text-left mb-1 cursor-pointer w-max self-start"
    >
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </span>
  {/if}
  <input
    use:typeAction
    bind:value
    on:keydown={(e) => dispatcher('keydown', e)}
    on:input={(e) => dispatcher('input', e)}
    on:change={(e) => dispatcher('change', e)}
    {...$$restProps}
    class={className}
    {required}
  />
</label>
