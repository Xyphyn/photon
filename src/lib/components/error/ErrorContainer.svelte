<script lang="ts" module>
  interface PageScopedError {
    scope: string
    message: string
  }

  let errors = $state<PageScopedError[]>([])

  export function pushError(args: { scope: string; message: string }) {
    errors.push(args)
  }

  export function clearErrorScope(scope: string | null | undefined) {
    errors = errors.filter(error => error.scope != scope)
  }
</script>

<script lang="ts">
  import { Button } from 'mono-svelte'
  import { onDestroy } from 'svelte'
  import { Icon, XCircle, XMark } from 'svelte-hero-icons'
  import { expoOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  onDestroy(() => {
    clearErrorScope(scope)
  })
  interface Props {
    scope?: string | undefined | null
    class?: string
  }

  let { scope = undefined, class: clazz = '' }: Props = $props()

  let scopedErrors = $derived(
    errors.filter(e => e.scope == scope || e.scope == 'global'),
  )
</script>

{#if scopedErrors.length > 0}
  <div
    class={clazz}
    in:slide={{ duration: 400, easing: expoOut }}
    out:slide={{ duration: 400, delay: 400, easing: expoOut }}
  >
    <div
      class="flex flex-row p-1.5 bg-red-100/50 dark:bg-red-900/10 rounded-xl border border-red-300/40 gap-2 items-center"
      in:fly={{ y: -8, duration: 400, delay: 200, opacity: 0, easing: expoOut }}
      out:fly={{ y: -8, duration: 400, opacity: 0, easing: expoOut }}
    >
      <Icon
        src={XCircle}
        size="28"
        mini
        class={[
          'relative self-center shrink-0 p-0.5 rounded-full',
          'bg-red-400 dark:bg-red-400 dark:text-red-900 text-red-50',
        ]}
      />
      <div class="flex flex-col text-sm font-medium gap-4">
        {#each scopedErrors as error}
          {error.message}
        {/each}
      </div>
      <Button
        onclick={() => clearErrorScope(scope)}
        color="tertiary"
        size="square-sm"
        class="ml-auto"
      >
        <Icon src={XMark} size="16" micro />
      </Button>
    </div>
  </div>
{/if}
