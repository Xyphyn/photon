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
  import { Button, Material } from 'mono-svelte'
  import {
    ArrowDownTray,
    Icon,
    MagnifyingGlassMinus,
    MagnifyingGlassPlus,
    Share,
    XMark,
  } from 'svelte-hero-icons'
  import { backOut, elasticOut, expoOut } from 'svelte/easing'
  import { fade, fly, scale } from 'svelte/transition'
  import { focusTrap } from 'svelte-focus-trap'

  /**
   * The full-resolution image URL
   */
  export let alt: string = ''

  let zoomed = false
</script>

{#if $page.state.openImage || '' != ''}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-positive-tabindex -->
  <div
    class="!isolate fixed top-0 left-0 w-screen h-screen overflow-auto bg-black/50
    flex flex-col z-[200] overscroll-contain backdrop-blur-sm"
    transition:fade={{ duration: 150 }}
    on:click={() => history.back()}
    on:keydown={(e) => {
      if (e.key == 'Escape') history.back()
    }}
    use:focusTrap
  >
    <img
      width={400}
      height={400}
      src={$page.state.openImage}
      class="w-full object-contain mx-auto my-auto overscroll-contain bg-white dark:bg-zinc-900"
      class:max-w-screen-md={!zoomed}
      transition:scale={{ start: 0.95, easing: expoOut, duration: 250 }}
      {alt}
    />
    <div
      class="sticky z-10 bottom-4 w-max mx-auto"
      transition:fly={{ duration: 350, y: 14, easing: backOut }}
    >
      <Material
        class="gap-1 p-2 flex flex-row items-center"
        rounding="full"
        padding="none"
        on:click={(e) => e.stopPropagation()}
      >
        <Button
          download
          href={$page.state.openImage}
          color="tertiary"
          size="square-lg"
          rounding="pill"
        >
          <Icon src={ArrowDownTray} size="20" micro />
        </Button>
        <Button
          on:click={() => {
            navigator?.share?.($page.state.openImage) ??
              navigator.clipboard.writeText($page.state.openImage)
          }}
          color="tertiary"
          size="square-lg"
          rounding="pill"
        >
          <Icon src={Share} size="20" micro />
        </Button>
        <Button
          on:click={() => {
            zoomed = !zoomed
          }}
          color="tertiary"
          size="square-lg"
          rounding="pill"
        >
          <Icon
            src={zoomed ? MagnifyingGlassMinus : MagnifyingGlassPlus}
            size="20"
            micro
          />
        </Button>
        <Button
          on:click={() => history.back()}
          color="tertiary"
          size="square-lg"
          rounding="pill"
        >
          <Icon src={XMark} size="20" micro slot="prefix" />
        </Button>
      </Material>
    </div>
  </div>
{/if}

<button on:click={() => history.back()} class="contents {$$props.class}">
  <slot />
</button>
