<script lang="ts">
  import { Button } from 'mono-svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'

  /**
   * The full-resolution image URL
   */
  export let url: string
  export let alt: string = ''
  export let open: boolean = false
</script>

<svelte:body
  on:keydown={(e) => {
    if (open && e.code == 'Escape') open = false
  }}
/>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-positive-tabindex -->
  <div
    class="fixed top-0 left-0 w-screen h-screen overflow-auto bg-black/50 flex flex-col z-[100] overscroll-contain"
    transition:fade={{ duration: 200 }}
    on:click={() => (open = false)}
  >
    <Button
      size="square-md"
      class="absolute z-[110] top-0 right-0 m-4"
      on:click={() => (open = false)}
    >
      <Icon src={XMark} size="16" mini slot="prefix" />
    </Button>
    <img
      src={url}
      class="w-full h-full object-contain max-w-screen-sm mx-auto my-auto overscroll-contain"
      transition:scale={{ start: 0.9, easing: expoOut }}
      {alt}
    />
  </div>
{/if}

<button on:click={() => (open = !open)} class="w-max">
  <slot />
</button>
