<script lang="ts" context="module">
  import { pushState } from '$app/navigation'

  export function showImage(url: string, alt: string = '') {
    pushState('', {
      openImage: url,
    })
  }
</script>

<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from 'mono-svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { backOut, expoOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'

  /**
   * The full-resolution image URL
   */
  export let alt: string = ''
</script>

{#if $page.state.openImage || '' != ''}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-positive-tabindex -->
  <div
    class="!isolate fixed top-0 left-0 w-screen h-screen overflow-auto bg-black/50
    flex flex-col z-[200] overscroll-contain"
    transition:fade={{ duration: 200 }}
    on:click={() => history.back()}
  >
    <Button size="square-md" class="fixed z-[110] top-0 right-0 m-4">
      <Icon src={XMark} size="16" mini slot="prefix" />
    </Button>
    <img
      width={400}
      height={400}
      src={$page.state.openImage}
      class="w-full h-auto object-contain max-w-screen-sm mx-auto my-auto overscroll-contain bg-white dark:bg-zinc-900"
      transition:scale={{ start: 0.9, easing: backOut }}
      {alt}
    />
  </div>
{/if}

<button on:click={() => history.back()} class="contents {$$props.class}">
  <slot />
</button>
