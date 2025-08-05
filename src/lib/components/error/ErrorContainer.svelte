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
  import { onDestroy } from 'svelte'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
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
    class={['flex flex-col gap-4', clazz]}
    in:slide={{ duration: 400, easing: expoOut }}
    out:slide={{ duration: 400, delay: 400, easing: expoOut }}
  >
    <div
      in:fly|global={{
        y: -8,
        duration: 400,
        delay: 200,
        opacity: 0,
        easing: expoOut,
      }}
      out:fly={{ y: -8, duration: 400, opacity: 0, easing: expoOut }}
      class="bg-red-400/10 border border-red-500/30 text-red-900 dark:text-red-50 rounded-2xl p-4"
    >
      <Icon
        src={ExclamationTriangle}
        size="32"
        mini
        class="inline-block rounded-lg bg-red-500 p-1.5 text-white clear-both float-left mr-2"
      />
      {#each scopedErrors as error}
        <p>{error.message}</p>
      {/each}
    </div>
  </div>
{/if}
