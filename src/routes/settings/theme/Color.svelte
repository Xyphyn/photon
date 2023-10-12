<script lang="ts">
  export let name: string
  export let value: string = ''
  export let fallback: string | undefined = undefined
</script>

<div class="flex flex-col">
  <div
    class="relative w-12 h-8 cursor-pointer rounded-md border hover:border-slate-400
     hover:dark:border-zinc-400 transition-colors dark:border-zinc-800 {fallback}"
    style:background-color={value == '' ? '' : value}
    style="background-color: {value};"
  >
    <input
      type="color"
      class="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
      bind:value
    />
  </div>
  <span class="font-semibold">{name}</span>
  {#if value}
    <span class="text-xs opacity-70">{value}</span>
  {/if}
</div>
