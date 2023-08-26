<script lang="ts">
  export let object: any
  export let isParent: boolean = false
</script>

<ul class:ml-4={!isParent} class="leading-8">
  {#each Object.keys(object) as key}
    <details open={false}>
      <summary class="cursor-pointer">
        <code>{key}</code>
      </summary>
      {#if typeof object[key] === 'object'}
        <svelte:self object={object[key]} isParent={false} />
      {:else}
        <pre class="break-words">{object[key]}</pre>
      {/if}
    </details>
  {/each}
</ul>
