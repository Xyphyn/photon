<script lang="ts">
  import { pushState, replaceState } from '$app/navigation'
  import { page } from '$app/state'
  import { Button } from 'mono-svelte'
  import Portal from 'mono-svelte/popover/Portal.svelte'
  import type { Snippet } from 'svelte'
  import { XMark } from 'svelte-hero-icons/dist'
  import { backOut } from 'svelte/easing'
  import type { ClassValue } from 'svelte/elements'
  import { fade, scale } from 'svelte/transition'
  import { trapFocus } from 'trap-focus-svelte'

  interface Props {
    action?: string | undefined
    open?: boolean
    title?: string | undefined | null
    dismissable?: boolean
    class?: ClassValue
    customTitle?: Snippet
    children?: Snippet
    actions?: Snippet<[{ action: string }]>
    ondismissed?: () => void
    onaction?: () => void
  }

  let {
    action = undefined,
    open = $bindable(false),
    title = undefined,
    dismissable = true,
    customTitle,
    children,
    actions,
    ondismissed,
    onaction,
    class: clazz = '',
  }: Props = $props()

  const modalId = crypto.randomUUID()

  let el = $state<HTMLElement>()
  let hasHistoryEntry = false

  $effect(() => {
    if (open && modalId && !hasHistoryEntry) {
      pushState('', {
        openModals: [...(page.state.openModals ?? []), modalId],
      })
      hasHistoryEntry = true
    }
  })

  $effect(() => {
    if (modalId && hasHistoryEntry) {
      const currentModals = page.state.openModals ?? []
      const isInHistory = currentModals.includes(modalId)

      if (!isInHistory && open) {
        replaceState('', {
          openModals: currentModals.filter((id) => id !== modalId),
        })
        hasHistoryEntry = false
        open = false
      }
    }
  })

  function onclose() {
    open = false

    if ((page.state.openModals ?? []).includes(modalId)) history.back()
    hasHistoryEntry = false

    ondismissed?.()
  }
</script>

<Portal>
  {#if open}
    <!--svelte-ignore a11y_interactive_supports_focus-->
    <!--svelte-ignore  a11y_click_events_have_key_events-->
    <div
      role="dialog"
      class={[
        'overflow-hidden fixed top-0 left-0 w-screen h-screen z-100',
        'flex flex-col items-center justify-center backdrop-blur-xs',
        'bg-white/50 dark:bg-black/50 box-border p-4',
      ]}
      transition:fade|global={{ duration: 100 }}
      onclick={(e) => {
        // @ts-expect-error html node hell
        if (!el.contains(e.target)) onclose()
      }}
    >
      <div
        bind:this={el}
        use:trapFocus
        transition:scale|global={{
          start: 0.97,
          easing: backOut,
          duration: 300,
        }}
        class={[
          'w-full border border-slate-200 border-b-slate-300 dark:border-zinc-900',
          'rounded-2xl max-w-lg box-border mx-auto overscroll-contain shadow-lg overflow-auto',
          'p-5 flex flex-col gap-2 dark:bg-zinc-950 bg-slate-50 relative',
          clazz,
        ]}
      >
        {#if dismissable}
          <Button
            class="absolute top-0 right-0 m-2 text-slate-600 dark:text-zinc-400"
            color="tertiary"
            size="square-sm"
            onclick={onclose}
            icon={XMark}
          ></Button>
        {/if}
        {#if title !== null}
          <h1 class="font-medium tracking-tight text-xl leading-5 max-w-full">
            {#if customTitle}
              {@render customTitle?.()}
            {:else if title}
              {title}
            {/if}
          </h1>
        {/if}
        {@render children?.()}
        {#if action}
          <div class="mt-2 flex w-full">
            {#if actions}{@render actions({ action })}{:else}
              <Button
                class="w-full"
                onclick={() => {
                  onaction?.()
                  onclose()
                }}
                color="primary"
                size="lg"
                rounding="xl"
              >
                {action}
              </Button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Portal>
