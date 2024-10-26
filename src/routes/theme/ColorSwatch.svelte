<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { hexToRgb } from '$lib/ui/colors'
  import { createEventDispatcher } from 'svelte'


  const dispatch = createEventDispatcher<{ change: string }>()

  interface Props {
    value: string;
    class?: string;
  }

  let { value = $bindable(), class: clazz = '' }: Props = $props();
  
</script>

<div
  class="w-full h-8 relative rounded-md border dark:border-zinc-600 hover:dark:border-zinc-400
  transition-colors {clazz}"
  style="background-color: rgb({value});"
>
  <input
    class="rounded-md border cursor-pointer absolute top-0 left-0 w-full h-full opacity-0"
    type="color"
    bind:value
    onchange={() => dispatch('change', hexToRgb(value))}
    oncontextmenu={bubble('contextmenu')}
  />
</div>
