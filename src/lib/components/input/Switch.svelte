<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let enabled = false
  const dispatcher = createEventDispatcher<{ change: boolean }>()
</script>

<label>
  <div
    class="relative w-10 border-2 h-6 transition-colors cursor-pointer
      rounded-full flex flex-row items-center {enabled
      ? 'bg-blue-500 border-blue-500'
      : 'bg-slate-200 dark:bg-zinc-800 border-slate-200 dark:border-zinc-800'}"
  >
    <div
      class="w-5 h-5 rounded-full transition-transform
      bg-white dark:bg-zinc-700 {enabled ? 'translate-x-4' : 'translate-x-0'}"
    />
  </div>
  <input
    type="checkbox"
    bind:checked={enabled}
    class="hidden"
    on:input={(e) => {
      dispatcher('change', !enabled)
    }}
  />
</label>
