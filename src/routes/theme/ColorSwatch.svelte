<script lang="ts">
  export let backgroundColor: string = ''
  export let value: string
</script>

<div
  class="w-full h-8 relative rounded-md border dark:border-zinc-600 hover:dark:border-zinc-400
  transition-colors {$$props.class}"
  style="background-color: {backgroundColor}"
>
  <input
    class="rounded-md border cursor-pointer absolute top-0 left-0 w-full h-full opacity-0"
    type="color"
    bind:value
  />
</div>
