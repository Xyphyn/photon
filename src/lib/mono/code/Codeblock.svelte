<script lang="ts">
  import Button from '../button/Button.svelte'
  import Material from '../materials/Material.svelte'
  import { Check, Icon, Clipboard } from 'svelte-hero-icons'
  import { scale } from 'svelte/transition'

  export let src: string
  export let filename: string | undefined = undefined
  export let htmlSrc: string | undefined = undefined

  let copied = false

  let pre: HTMLPreElement

  const copy = () => {
    if ($$slots.default) {
      if (pre) navigator.clipboard.writeText(pre.innerText)
    } else if (src) {
      navigator.clipboard.writeText(src)
    }
  }
</script>

<Material
  class="overflow-hidden flex flex-col divide-y divide-slate-200 dark:divide-zinc-800"
  padding="none"
  rounding="md"
>
  {#if filename}
    <div class="flex flex-row items-center justify-between p-3 px-4 text-xs">
      <span>
        {filename}
      </span>
      <Button
        size="square-sm"
        color="tertiary"
        aria-label="Copy"
        on:click={() => {
          copied = true
          copy()
          setTimeout(() => (copied = false), 2000)
        }}
      >
        <div class="relative w-full h-full grid place-items-center">
          {#if !copied}
            <div
              transition:scale={{ opacity: 0, start: 0.3 }}
              style="grid-row: 1; grid-column: 1;"
            >
              <Icon src={Clipboard} size="16" slot="prefix" />
            </div>
          {:else}
            <div
              transition:scale={{ opacity: 0, start: 0.3 }}
              style="grid-row: 1; grid-column: 1;"
            >
              <Icon src={Check} size="16" mini slot="prefix" />
            </div>
          {/if}
        </div>
      </Button>
    </div>
  {/if}
  <pre
    bind:this={pre}
    {...$$restProps}
    class="{$$props.class} bg-white dark:bg-zinc-900 px-4 overflow-auto max-h-96">
		{#if htmlSrc}
      {@html htmlSrc}
    {:else if $$slots.default}
      <slot />
    {:else if src}
      {src}
    {/if}
	</pre>
</Material>
