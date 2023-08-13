<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { createEventDispatcher } from 'svelte'
  import { Icon, XMark } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'

  export let action: string | undefined = undefined
  export let open = false

  const dispatcher = createEventDispatcher()
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="overflow-hidden fixed top-0 left-0 w-screen h-screen z-50
flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm box-border p-4"
    transition:fade={{ duration: 200 }}
    on:click={() => (open = false)}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      transition:scale={{ start: 0.9, easing: expoOut }}
      class="overflow-y-auto {$$props.class} rounded-xl max-w-full box-border w-full"
    >
      <div
        class="w-full dark:!bg-zinc-950 rounded-xl max-w-xl box-border mx-auto"
        on:click={() => {}}
      >
        <div class="p-6 flex flex-col gap-4 w-full dark:bg-zinc-950 bg-white border border-slate-200 dark:border-zinc-800">
          <div class="flex flex-row max-w-full">
            <h1 class="font-bold text-2xl w-max max-w-full">
              <slot name="title" />
            </h1>
            <Button class="!p-2 ml-auto" on:click={() => (open = false)}>
              <Icon src={XMark} mini size="16" />
            </Button>
          </div>
          <slot />
        </div>
        {#if action}
          <div
            class="border-t bg-slate-100 dark:bg-zinc-900 dark:border-zinc-800 p-3 py-2 flex justify-end rounded-b-xl"
          >
            <slot name="action">
              <Button
                on:click={(e) => dispatcher('action', e)}
                color="primary"
                size="lg"
              >
                {action}
              </Button>
            </slot>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
