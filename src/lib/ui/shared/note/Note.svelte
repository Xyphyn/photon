<script lang="ts">
  import { Material } from 'mono-svelte'
  import { Icon, InformationCircle } from 'svelte-hero-icons/dist'
  import type { ClassValue } from 'svelte/elements'

  interface Props {
    content?: string | undefined
    children?: import('svelte').Snippet
    class?: ClassValue
  }

  let { content = undefined, children, class: clazz = '' }: Props = $props()
</script>

<Material
  color="info"
  rounding="2xl"
  class={['flex flex-row items-center px-3 py-2.5', clazz]}
>
  <Icon
    src={InformationCircle}
    size="20"
    micro
    class="inline-block rounded-lg clear-both float-left mr-2"
  />
  <div class="flex flex-col md:flex-row items-center w-full">
    {#if children}
      {@render children?.()}
    {:else if content}
      <p>
        {content}
      </p>
    {/if}
  </div>
</Material>
