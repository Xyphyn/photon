<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Color } from '$lib/ui/colors.js'
  import Loading from '$lib/components/ui/Loading.svelte'

  export let color: Color = Color.secondary
  export let loading = false
  export let large = false
  export let disabled = false
  export let submit = false

  const dispatch = createEventDispatcher()
</script>

<button
  {disabled}
  on:click={(e) => dispatch('click', e)}
  class="{large
    ? 'w-full px-4 py-2'
    : 'px-3 py-1.5'} rounded-md {color} text-sm transition-all {disabled
    ? 'opacity-50 pointer-events-none'
    : ''}"
  type={submit ? 'submit' : 'button'}
>
  <div
    class="flex flex-row items-center justify-center gap-2"
    class:hidden={loading}
  >
    <slot name="icon" />
    <slot />
  </div>
  <div class="mx-auto py-2" class:hidden={!loading}><Loading /></div>
</button>
