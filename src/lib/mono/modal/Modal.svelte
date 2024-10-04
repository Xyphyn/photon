<script lang="ts">
  import { Button } from '../index.js'
  import { createEventDispatcher } from 'svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { backOut, expoOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'
  import { focusTrap } from 'svelte-focus-trap'
  import Portal from '../popover/Portal.svelte'

  export let action: string | undefined = undefined
  export let open = false
  export let title: string | undefined = undefined
  export let dismissable: boolean = true

  let el: any

  const dispatcher = createEventDispatcher<{ action: any; dismissed: any }>()
</script>

<Portal>
  {#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      role="dialog"
      class="overflow-hidden fixed top-0 left-0 w-screen h-screen z-[100]
flex flex-col items-center justify-center backdrop-blur-sm
bg-white/50 dark:bg-black/50 box-border p-4"
      transition:fade|global={{ duration: 100 }}
      on:click={(e) => {
        if (!el.contains(e.target)) {
          open = false

          dispatcher('dismissed')
        }
      }}
    >
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        bind:this={el}
        use:focusTrap
        transition:scale|global={{
          start: 0.97,
          easing: backOut,
          duration: 300,
        }}
        class="w-full border border-slate-200 border-b-slate-300
				dark:border-zinc-900 dark:border-t-zinc-800 dark:border-b-zinc-900
				rounded-2xl max-w-lg box-border mx-auto overscroll-contain shadow-lg overflow-auto
				p-5 flex flex-col gap-2 dark:bg-zinc-925
          bg-white relative"
      >
        {#if dismissable}
          <Button
            class="absolute top-0 right-0 m-2 text-slate-600 dark:text-zinc-400"
            color="tertiary"
            size="square-sm"
            on:click={() => {
              open = false
              dispatcher('dismissed')
            }}
          >
            <Icon src={XMark} size="20" mini slot="prefix" />
          </Button>
        {/if}
        <h1 class="font-semibold text-xl max-w-full">
          {#if $$slots.title}
            <slot name="title" />
          {:else if title}
            {title}
          {/if}
        </h1>
        <slot />
        {#if action}
          <div class="mt-2 flex w-full">
            <slot name="action" {action}>
              <Button
                class="w-full"
                on:click={(e) => {
                  dispatcher('action', e)
                  open = false
                  dispatcher('dismissed')
                }}
                color="primary"
                size="lg"
                rounding="xl"
              >
                {action}
              </Button>
            </slot>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Portal>
