<script lang="ts">
  import { Switch } from 'mono-svelte'

  export let title: string
  export let description: string | undefined = undefined
  export let checked: boolean = false
</script>

<div class="flex flex-row items-center w-full justify-between gap-4 max-w-full">
  <Switch
    bind:checked
    class="flex-row-reverse items-center w-full"
    labelClass="flex-1 mr-auto"
  >
    <h1 class="font-medium text-base">{title}</h1>
    {#if description}
      <p class="text-slate-800 dark:text-zinc-200 text-sm">
        {description}
      </p>
    {/if}
  </Switch>
</div>
