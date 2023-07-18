<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Color } from '$lib/ui/colors.js'
  import Loading from '$lib/components/ui/loader/Loading.svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'

  export let color: Color = Color.secondary
  export let loading = false
  export let large = false
  export let disabled = false
  export let submit = false
  export let label: string = ''
  export let spinner = false

  const dispatch = createEventDispatcher()
</script>

<button
  {disabled}
  on:click={(e) => dispatch('click', e)}
  class="{large
    ? 'w-full px-4 py-2'
    : 'px-3 py-1.5'} rounded-md {color} text-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
  type={submit ? 'submit' : 'button'}
  aria-label={label}
>
  <div
    class="flex flex-row items-center justify-center gap-2"
    class:hidden={loading}
  >
    <slot name="icon" />
    <slot />
  </div>
  <div class="mx-auto" class:hidden={!loading}>
    {#if spinner}
      <Spinner />
    {:else}
      <div class="py-2">
        <Loading />
      </div>
    {/if}
  </div>
</button>
