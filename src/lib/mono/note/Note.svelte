<script lang="ts">
  import { Material } from '../index.js'
  import { Icon, InformationCircle } from 'svelte-hero-icons'

  export let content: string | undefined = undefined
</script>

<Material padding="sm" class="flex flex-row space-x-2 items-center">
  <Icon src={InformationCircle} size="18" mini />
  <p>
    {#if $$slots.default}
      <slot />
    {:else if content}
      {content}
    {/if}
  </p>
</Material>
