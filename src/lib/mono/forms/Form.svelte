<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let title: string | undefined

  const dispatcher = createEventDispatcher<{ submit: SubmitEvent }>()

  let clazz: string = ''
  export { clazz as class }
</script>

<form
  on:submit={(e) => dispatcher('submit', e)}
  {...$$restProps}
  class="flex flex-col gap-4 {clazz}"
>
  {#if title || $$slots.title}
    {#if $$slots.title}
      <slot name="title" />
    {:else if title}
      <h1 class="text-2xl font-bold">{title}</h1>
    {/if}
  {/if}
  <slot />
</form>
